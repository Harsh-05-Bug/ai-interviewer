const express = require('express');
const router = express.Router();
const StudyGroup = require('../models/StudyGroup');
const Question = require('../models/Question');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const crypto = require('crypto');

const genCode = () => crypto.randomBytes(3).toString('hex').toUpperCase();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const { topic, search, mine, page = 1, limit = 12 } = req.query;
    const filter = { status: 'active' };

    if (mine === 'true' && req.headers.authorization) {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          filter['members.userId'] = decoded._id || decoded.id;
          delete filter.status;
        }
      } catch {}
    } else {
      filter.isPrivate = false;
    }

    if (topic && topic !== 'All') filter.topic = topic;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const total = await StudyGroup.countDocuments(filter);
    const groups = await StudyGroup.find(filter)
      .select('name description creatorId members maxMembers topic difficulty isPrivate tags status chatLocked createdAt')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    const sanitized = groups.map(g => ({
      ...g,
      memberCount: g.members?.length || 0,
      members: g.members?.slice(0, 5) || [],
      isFull: (g.members?.length || 0) >= g.maxMembers,
    }));

    res.json({ success: true, groups: sanitized, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single room
router.get('/:id', async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id).lean();
    if (!group) return res.status(404).json({ success: false, error: 'Room not found.' });
    group.messages = (group.messages || []).slice(-100);
    group.memberCount = group.members?.length || 0;
    res.json({ success: true, group });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create room
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, maxMembers, topic, difficulty, isPrivate, tags } = req.body;
    if (!name || name.length < 3) return res.status(400).json({ success: false, error: 'Room name must be at least 3 characters.' });

    const user = await User.findById(req.user._id);
    const userRooms = await StudyGroup.countDocuments({ creatorId: user._id, status: 'active' });
    if (userRooms >= 5) return res.status(400).json({ success: false, error: 'You can create max 5 active rooms.' });

    const group = await StudyGroup.create({
      name: name.trim(),
      description: description?.trim() || '',
      creatorId: user._id,
      maxMembers: Math.min(Math.max(parseInt(maxMembers) || 10, 2), 50),
      topic: topic || 'General',
      difficulty: difficulty || 'Mixed',
      isPrivate: !!isPrivate,
      joinCode: isPrivate ? genCode() : null,
      tags: tags || [],
      members: [{ userId: user._id, userName: user.name, userAvatar: user.avatar, role: 'admin' }],
    });

    res.status(201).json({ success: true, group });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Join room
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const { joinCode } = req.body;
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, error: 'Room not found.' });
    if (group.status === 'archived') return res.status(400).json({ success: false, error: 'Room is archived.' });

    const userId = req.user._id;
    if (group.members.some(m => m.userId.toString() === userId.toString())) return res.status(400).json({ success: false, error: 'Already a member.' });
    if (group.members.length >= group.maxMembers) return res.status(400).json({ success: false, error: 'Room is full.' });
    if (group.isPrivate && group.joinCode !== joinCode) return res.status(403).json({ success: false, error: 'Invalid join code.' });

    const user = await User.findById(userId);
    group.members.push({ userId: user._id, userName: user.name, userAvatar: user.avatar, role: 'member' });
    group.messages.push({ userId: user._id, userName: 'System', content: `${user.name} joined the room` });
    await group.save();
    res.json({ success: true, message: 'Joined successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Leave room
router.post('/:id/leave', authMiddleware, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, error: 'Room not found.' });

    const userId = req.user._id;
    const member = group.members.find(m => m.userId.toString() === userId.toString());
    if (!member) return res.status(400).json({ success: false, error: 'Not a member.' });

    if (member.role === 'admin' && group.members.length > 1) {
      const next = group.members.find(m => m.userId.toString() !== userId.toString());
      if (next) next.role = 'admin';
    }

    const user = await User.findById(userId);
    group.members = group.members.filter(m => m.userId.toString() !== userId.toString());
    group.messages.push({ userId: user._id, userName: 'System', content: `${user.name} left the room` });
    if (group.members.length === 0) group.status = 'archived';
    await group.save();
    res.json({ success: true, message: 'Left room.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Send message
router.post('/:id/message', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length < 1) return res.status(400).json({ success: false, error: 'Message cannot be empty.' });

    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, error: 'Room not found.' });

    const userId = req.user._id;
    const member = group.members.find(m => m.userId.toString() === userId.toString());
    if (!member) return res.status(403).json({ success: false, error: 'Must be a member to chat.' });

    if (group.chatLocked && member.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Chat is locked by admin.' });
    }

    const user = await User.findById(userId);
    group.messages.push({ userId: user._id, userName: user.name, userAvatar: user.avatar, content: content.trim() });
    if (group.messages.length > 200) group.messages = group.messages.slice(-200);
    await group.save();
    res.status(201).json({ success: true, message: group.messages[group.messages.length - 1] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Share question
router.post('/:id/share-question', authMiddleware, async (req, res) => {
  try {
    const { questionId } = req.body;
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, error: 'Room not found.' });

    const userId = req.user._id;
    if (!group.members.some(m => m.userId.toString() === userId.toString())) return res.status(403).json({ success: false, error: 'Must be a member.' });

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ success: false, error: 'Question not found.' });
    if (group.sharedQuestions.some(q => q.questionId?.toString() === questionId)) return res.status(400).json({ success: false, error: 'Already shared.' });

    const user = await User.findById(userId);
    group.sharedQuestions.push({ questionId: question._id, title: question.title, topic: question.topic, difficulty: question.difficulty, addedBy: user.name });
    group.messages.push({ userId: user._id, userName: 'System', content: `${user.name} shared "${question.title}" (${question.difficulty})` });
    await group.save();
    res.json({ success: true, question: group.sharedQuestions[group.sharedQuestions.length - 1] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Kick member (admin only)
router.post('/:id/kick/:userId', authMiddleware, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, error: 'Room not found.' });

    const admin = group.members.find(m => m.userId.toString() === req.user._id.toString());
    if (!admin || admin.role !== 'admin') return res.status(403).json({ success: false, error: 'Only admin can kick.' });

    const targetId = req.params.userId;
    if (targetId === req.user._id.toString()) return res.status(400).json({ success: false, error: 'Cannot kick yourself.' });

    const target = group.members.find(m => m.userId.toString() === targetId);
    if (!target) return res.status(400).json({ success: false, error: 'User not in room.' });

    group.members = group.members.filter(m => m.userId.toString() !== targetId);
    group.messages.push({ userId: req.user._id, userName: 'System', content: `${target.userName} was removed by admin` });
    await group.save();
    res.json({ success: true, message: `${target.userName} kicked.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Toggle chat lock (admin only)
router.post('/:id/toggle-chat', authMiddleware, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, error: 'Room not found.' });

    const admin = group.members.find(m => m.userId.toString() === req.user._id.toString());
    if (!admin || admin.role !== 'admin') return res.status(403).json({ success: false, error: 'Only admin can toggle chat.' });

    group.chatLocked = !group.chatLocked;
    group.messages.push({ userId: req.user._id, userName: 'System', content: group.chatLocked ? 'Chat has been locked by admin' : 'Chat has been unlocked by admin' });
    await group.save();
    res.json({ success: true, chatLocked: group.chatLocked });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Archive room (admin only)
router.post('/:id/archive', authMiddleware, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, error: 'Room not found.' });

    const admin = group.members.find(m => m.userId.toString() === req.user._id.toString());
    if (!admin || admin.role !== 'admin') return res.status(403).json({ success: false, error: 'Only admin can archive.' });

    group.status = 'archived';
    group.messages.push({ userId: req.user._id, userName: 'System', content: 'Room has been closed by admin' });
    await group.save();
    res.json({ success: true, message: 'Room archived.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Transfer ownership (admin only)
router.post('/:id/transfer/:userId', authMiddleware, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, error: 'Room not found.' });

    const admin = group.members.find(m => m.userId.toString() === req.user._id.toString());
    if (!admin || admin.role !== 'admin') return res.status(403).json({ success: false, error: 'Only admin can transfer.' });

    const target = group.members.find(m => m.userId.toString() === req.params.userId);
    if (!target) return res.status(400).json({ success: false, error: 'User not in room.' });

    admin.role = 'member';
    target.role = 'admin';
    group.messages.push({ userId: req.user._id, userName: 'System', content: `Admin transferred to ${target.userName}` });
    await group.save();
    res.json({ success: true, message: `Ownership transferred to ${target.userName}.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete message
router.delete('/:id/message/:msgId', authMiddleware, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, error: 'Room not found.' });

    const member = group.members.find(m => m.userId.toString() === req.user._id.toString());
    if (!member) return res.status(403).json({ success: false, error: 'Not a member.' });

    const msg = group.messages.id(req.params.msgId);
    if (!msg) return res.status(404).json({ success: false, error: 'Message not found.' });
    if (msg.userId.toString() !== req.user._id.toString() && member.role !== 'admin') return res.status(403).json({ success: false, error: 'Not authorized.' });

    group.messages.pull(req.params.msgId);
    await group.save();
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete room
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, error: 'Room not found.' });
    if (group.creatorId.toString() !== req.user._id.toString() && !req.user.isAdmin) return res.status(403).json({ success: false, error: 'Only creator can delete.' });
    await StudyGroup.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Room deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Stats
router.get('/meta/stats', async (req, res) => {
  try {
    const totalRooms = await StudyGroup.countDocuments({ status: 'active' });
    const topicStats = await StudyGroup.aggregate([{ $match: { status: 'active' } }, { $group: { _id: '$topic', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
    const totalMembers = await StudyGroup.aggregate([{ $match: { status: 'active' } }, { $project: { memberCount: { $size: '$members' } } }, { $group: { _id: null, total: { $sum: '$memberCount' } } }]);
    res.json({ success: true, totalRooms, topics: topicStats, totalMembers: totalMembers[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;