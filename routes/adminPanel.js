const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');
const Post = require('../models/Post');
const Review = require('../models/Review');
const StudyGroup = require('../models/StudyGroup');
const AdminConfig = require('../models/AdminConfig');
const ArchivedUser = require('../models/ArchivedUser');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const { authMiddleware } = require('../middleware/auth');
const { clearCache } = require('../middleware/featureCheck');
const logActivity = require('../helpers/logActivity');

const adminOnly = async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ success: false, error: 'Admin access required.' });
  next();
};

const getOrCreateConfig = async () => {
  let config = await AdminConfig.findOne();
  if (!config) {
    const hashedCode = await bcrypt.hash('12345678', 10);
    config = await AdminConfig.create({
      secretCode: hashedCode,
      features: [
        { name: 'Forum', key: 'forum', enabled: true },
        { name: 'Study Rooms', key: 'studyrooms', enabled: true },
        { name: 'Code Compiler', key: 'compiler', enabled: true },
        { name: 'Question Bank', key: 'questions', enabled: true },
        { name: 'Leaderboard', key: 'leaderboard', enabled: true },
        { name: 'Company Reviews', key: 'reviews', enabled: true },
        { name: 'Voice Calls', key: 'voicecalls', enabled: true },
        { name: 'Google OAuth', key: 'google_oauth', enabled: true },
        { name: 'Email Verification', key: 'email_verify', enabled: true },
        { name: 'AI Interviews', key: 'interviews', enabled: true },
        { name: 'Public Profiles', key: 'public_profiles', enabled: true },
        { name: 'Contact Form', key: 'contact', enabled: true },
      ],
    });
  }
  return config;
};

const verifySecret = async (code) => {
  const config = await getOrCreateConfig();
  return bcrypt.compare(code, config.secretCode);
};

// ─── DASHBOARD ───
router.get('/dashboard', authMiddleware, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });
    const newUsersWeek = await User.countDocuments({ createdAt: { $gte: weekAgo } });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    const totalSessions = await Session.countDocuments();
    const sessionsToday = await Session.countDocuments({ startedAt: { $gte: today } });
    const sessionsWeek = await Session.countDocuments({ startedAt: { $gte: weekAgo } });
    const completedSessions = await Session.countDocuments({ status: 'completed' });

    const totalPosts = await Post.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalStudyGroups = await StudyGroup.countDocuments({ status: 'active' });
    const archivedUsers = await ArchivedUser.countDocuments();

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: monthAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const featureUsage = await ActivityLog.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentActivity = await ActivityLog.find().sort({ createdAt: -1 }).limit(20).lean();

    res.json({
      success: true,
      dashboard: {
        users: { total: totalUsers, verified: verifiedUsers, newToday: newUsersToday, newWeek: newUsersWeek, blocked: blockedUsers, archived: archivedUsers },
        sessions: { total: totalSessions, today: sessionsToday, week: sessionsWeek, completed: completedSessions },
        content: { posts: totalPosts, reviews: totalReviews, studyGroups: totalStudyGroups },
        userGrowth, featureUsage, recentActivity,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── ALL USERS ───
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { search, status, sort = 'newest', page = 1, limit = 50 } = req.query;
    const filter = {};
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    if (status === 'blocked') filter.isBlocked = true;
    if (status === 'verified') filter.isVerified = true;
    if (status === 'unverified') filter.isVerified = false;

    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    if (sort === 'name') sortObj = { name: 1 };

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password -verificationToken -resetPasswordToken')
      .sort(sortObj)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    const userIds = users.map(u => u._id);
    const sessionCounts = await Session.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 }, avgScore: { $avg: '$report.overallScore' }, lastSession: { $max: '$startedAt' } } },
    ]);

    const sessionMap = {};
    sessionCounts.forEach(s => { sessionMap[s._id.toString()] = s; });

    const enriched = users.map(u => ({
      ...u,
      sessionCount: sessionMap[u._id.toString()]?.count || 0,
      avgScore: Math.round(sessionMap[u._id.toString()]?.avgScore || 0),
      lastActive: sessionMap[u._id.toString()]?.lastSession || u.createdAt,
    }));

    res.json({ success: true, users: enriched, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── SINGLE USER DETAIL ───
router.get('/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -verificationToken -resetPasswordToken').lean();
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const sessions = await Session.find({ userId: user._id }).sort({ startedAt: -1 }).lean();
    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    const reviews = await Review.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    const activity = await ActivityLog.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50).lean();
    const scores = sessions.filter(s => s.report?.overallScore > 0).map(s => s.report.overallScore);

    res.json({
      success: true,
      user,
      stats: {
        totalSessions: sessions.length,
        completedSessions: sessions.filter(s => s.status === 'completed').length,
        avgScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
        bestScore: scores.length > 0 ? Math.max(...scores) : 0,
        totalPosts: posts.length,
        totalReviews: reviews.length,
      },
      sessions: sessions.slice(0, 20),
      posts: posts.slice(0, 10),
      reviews: reviews.slice(0, 10),
      activity,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── BLOCK/UNBLOCK USER ───
router.post('/users/:id/block', authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    if (user.isAdmin) return res.status(400).json({ success: false, error: 'Cannot block admin.' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    await logActivity({
      userId: req.user._id, userName: req.user.name,
      action: user.isBlocked ? 'Blocked user' : 'Unblocked user',
      category: 'admin', details: `${user.name} (${user.email})`, req
    });

    res.json({ success: true, blocked: user.isBlocked, message: user.isBlocked ? 'User blocked.' : 'User unblocked.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── DELETE USER (requires secret code) ───
router.post('/users/:id/delete', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { secretCode, reason } = req.body;
    if (!secretCode) return res.status(400).json({ success: false, error: '8-digit secret code required.' });

    const valid = await verifySecret(secretCode);
    if (!valid) return res.status(403).json({ success: false, error: 'Invalid secret code.' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    if (user.isAdmin) return res.status(400).json({ success: false, error: 'Cannot delete admin.' });

    // Get user data for archiving
    const sessions = await Session.find({ userId: user._id }).lean();
    const posts = await Post.find({ userId: user._id }).lean();
    const reviews = await Review.find({ userId: user._id }).lean();
    const scores = sessions.filter(s => s.report?.overallScore > 0).map(s => s.report.overallScore);

    // Archive user data
    await ArchivedUser.create({
      originalId: user._id,
      name: user.name, email: user.email, avatar: user.avatar,
      phone: user.phone, college: user.college, graduationYear: user.graduationYear,
      currentCompany: user.currentCompany, github: user.github, linkedin: user.linkedin,
      bio: user.bio, skills: user.skills, location: user.location,
      joinedAt: user.createdAt, deletedBy: 'admin', reason: reason || '',
      totalSessions: sessions.length,
      avgScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      bestScore: scores.length > 0 ? Math.max(...scores) : 0,
      sessions: sessions.slice(0, 50), posts, reviews, notes: user.notes || [],
    });

    // Delete user data
    await Session.deleteMany({ userId: user._id });
    await Post.deleteMany({ userId: user._id });
    await Review.deleteMany({ userId: user._id });
    const Contact = require('../models/Contact');
    await Contact.deleteMany({ userId: user._id });
    await User.deleteOne({ _id: user._id });

    await logActivity({
      userId: req.user._id, userName: req.user.name,
      action: 'Deleted user (archived)', category: 'admin',
      details: `${user.name} (${user.email}) - ${reason || 'No reason'}`, req
    });

    res.json({ success: true, message: 'User deleted and archived.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── FEATURE TOGGLES ───
router.get('/features', authMiddleware, adminOnly, async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.json({ success: true, features: config.features });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/features', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { features, secretCode } = req.body;
    if (!secretCode) return res.status(400).json({ success: false, error: '8-digit secret code required.' });

    const valid = await verifySecret(secretCode);
    if (!valid) return res.status(403).json({ success: false, error: 'Invalid secret code.' });

    const config = await getOrCreateConfig();
    features.forEach(f => {
      const existing = config.features.find(ef => ef.key === f.key);
      if (existing) { existing.enabled = f.enabled; existing.updatedAt = new Date(); }
    });
    await config.save();
    clearCache();

    const changed = features.map(f => `${f.key}: ${f.enabled ? 'ON' : 'OFF'}`).join(', ');
    await logActivity({ userId: req.user._id, userName: req.user.name, action: 'Updated feature toggles', category: 'admin', details: changed, req });

    res.json({ success: true, features: config.features });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── CHANGE SECRET CODE ───
router.post('/change-secret', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { currentCode, newCode } = req.body;
    if (!currentCode || !newCode) return res.status(400).json({ success: false, error: 'Both codes required.' });
    if (newCode.length !== 8) return res.status(400).json({ success: false, error: 'Code must be exactly 8 digits.' });

    const valid = await verifySecret(currentCode);
    if (!valid) return res.status(403).json({ success: false, error: 'Current code is wrong.' });

    const config = await getOrCreateConfig();
    config.secretCode = await bcrypt.hash(newCode, 10);
    await config.save();

    await logActivity({ userId: req.user._id, userName: req.user.name, action: 'Changed secret code', category: 'admin', req });
    res.json({ success: true, message: 'Secret code changed.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── SEND OTP ───
router.post('/send-otp', authMiddleware, adminOnly, async (req, res) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const config = await getOrCreateConfig();
    config.otpCode = await bcrypt.hash(otp, 10);
    config.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await config.save();

    const { sendOTPEmail } = require('../helpers/email');
    await sendOTPEmail(req.user.email, req.user.name, otp);

    res.json({ success: true, message: 'OTP sent to your email.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── CHANGE ADMIN PASSWORDS (1 or both) ───
router.post('/change-password', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { otp, newPass1, newPass2, secretCode } = req.body;
    if (!otp || !secretCode) return res.status(400).json({ success: false, error: 'OTP and secret code required.' });
    if (!newPass1 && !newPass2) return res.status(400).json({ success: false, error: 'Enter at least one new password.' });

    const validSecret = await verifySecret(secretCode);
    if (!validSecret) return res.status(403).json({ success: false, error: 'Invalid secret code.' });

    const config = await getOrCreateConfig();
    if (!config.otpCode || !config.otpExpires || config.otpExpires < new Date())
      return res.status(400).json({ success: false, error: 'OTP expired. Request a new one.' });

    const validOTP = await bcrypt.compare(otp, config.otpCode);
    if (!validOTP) return res.status(400).json({ success: false, error: 'Invalid OTP.' });

    // Save new passwords in AdminConfig (overrides .env)
    if (newPass1) config.adminPass1 = newPass1;
    if (newPass2) config.adminPass2 = newPass2;

    config.otpCode = null;
    config.otpExpires = null;
    await config.save();

    await logActivity({
      userId: req.user._id, userName: req.user.name,
      action: `Changed admin password(s): ${newPass1 ? 'Pass1' : ''} ${newPass2 ? 'Pass2' : ''}`.trim(),
      category: 'admin', req
    });

    const changed = [];
    if (newPass1) changed.push('Password 1');
    if (newPass2) changed.push('Password 2');
    res.json({ success: true, message: `${changed.join(' & ')} changed successfully!` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── CHANGE ADMIN USERNAME ───
router.post('/change-username', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { newUsername, secretCode } = req.body;
    if (!newUsername || !secretCode) return res.status(400).json({ success: false, error: 'Username and secret code required.' });
    if (newUsername.length < 3) return res.status(400).json({ success: false, error: 'Username too short.' });

    const validSecret = await verifySecret(secretCode);
    if (!validSecret) return res.status(403).json({ success: false, error: 'Invalid secret code.' });

    const config = await getOrCreateConfig();
    config.adminUsername = newUsername;
    await config.save();

    await logActivity({ userId: req.user._id, userName: req.user.name, action: 'Changed admin username', category: 'admin', req });
    res.json({ success: true, message: 'Username changed. Use new username to login next time.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── NOTIFICATIONS: Send to ALL ───
router.post('/notify/all', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    if (!title || !message) return res.status(400).json({ success: false, error: 'Title and message required.' });

    const notif = await Notification.create({
      isGlobal: true,
      title: title.trim(),
      message: message.trim(),
      type: type || 'info',
      sentBy: req.user.name,
    });

    await logActivity({ userId: req.user._id, userName: req.user.name, action: 'Sent notification to all users', category: 'admin', details: title, req });
    res.json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── NOTIFICATIONS: Send to one user ───
router.post('/notify/user/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    if (!title || !message) return res.status(400).json({ success: false, error: 'Title and message required.' });

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, error: 'User not found.' });

    const notif = await Notification.create({
      userId: targetUser._id,
      isGlobal: false,
      title: title.trim(),
      message: message.trim(),
      type: type || 'personal',
      sentBy: req.user.name,
    });

    await logActivity({ userId: req.user._id, userName: req.user.name, action: `Sent personal notification to ${targetUser.name}`, category: 'admin', details: title, req });
    res.json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── NOTIFICATIONS: Get all sent (admin view) ───
router.get('/notifications', authMiddleware, adminOnly, async (req, res) => {
  try {
    const notifs = await Notification.find().sort({ createdAt: -1 }).limit(50).lean();
    res.json({ success: true, notifications: notifs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── NOTIFICATIONS: Delete ───
router.delete('/notifications/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Notification.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Notification deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── USER NOTIFICATIONS (for regular users) ───
router.get('/my-notifications', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const notifs = await Notification.find({
      $or: [{ isGlobal: true }, { userId: userId }]
    }).sort({ createdAt: -1 }).limit(30).lean();

    const enriched = notifs.map(n => ({
      ...n,
      isRead: n.readBy?.some(id => id.toString() === userId.toString()) || false,
    }));

    const unreadCount = enriched.filter(n => !n.isRead).length;
    res.json({ success: true, notifications: enriched, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── MARK NOTIFICATION AS READ ───
router.post('/my-notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ success: false, error: 'Not found.' });

    if (!notif.readBy.includes(req.user._id)) {
      notif.readBy.push(req.user._id);
      await notif.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── ACTIVITY LOGS ───
router.get('/activity', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { category, userId, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (userId) filter.userId = userId;

    const total = await ActivityLog.countDocuments(filter);
    const logs = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, logs, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── ARCHIVED USERS ───
router.get('/archived', authMiddleware, adminOnly, async (req, res) => {
  try {
    const archived = await ArchivedUser.find().sort({ deletedAt: -1 }).lean();
    res.json({ success: true, archived });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/archived/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await ArchivedUser.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ success: false, error: 'Not found.' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/archived/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { secretCode } = req.body;
    const valid = await verifySecret(secretCode);
    if (!valid) return res.status(403).json({ success: false, error: 'Invalid secret code.' });

    await ArchivedUser.deleteOne({ _id: req.params.id });
    await logActivity({ userId: req.user._id, userName: req.user.name, action: 'Permanently deleted archived user', category: 'admin', req });

    res.json({ success: true, message: 'Permanently deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── ADMIN FORGOT PASSWORD (no auth needed) ───
router.post('/admin-forgot', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email required.' });

    const user = await User.findOne({ email, isAdmin: true });
    if (!user) return res.status(404).json({ success: false, error: 'Admin account not found with this email.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const config = await getOrCreateConfig();
    config.otpCode = await bcrypt.hash(otp, 10);
    config.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await config.save();

    const { sendOTPEmail } = require('../helpers/email');
    await sendOTPEmail(email, user.name, otp);

    res.json({ success: true, message: 'OTP sent.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── ADMIN RESET PASSWORD (no auth needed) ───
router.post('/admin-reset', async (req, res) => {
  try {
    const { email, otp, newPass1, newPass2 } = req.body;
    if (!email || !otp || !newPass1 || !newPass2)
      return res.status(400).json({ success: false, error: 'All fields required.' });

    const user = await User.findOne({ email, isAdmin: true });
    if (!user) return res.status(404).json({ success: false, error: 'Admin not found.' });

    const config = await getOrCreateConfig();
    if (!config.otpCode || !config.otpExpires || config.otpExpires < new Date())
      return res.status(400).json({ success: false, error: 'OTP expired.' });

    const validOTP = await bcrypt.compare(otp, config.otpCode);
    if (!validOTP) return res.status(400).json({ success: false, error: 'Invalid OTP.' });

    config.adminPass1 = newPass1;
    config.adminPass2 = newPass2;
    config.otpCode = null;
    config.otpExpires = null;
    await config.save();

    await logActivity({
      userId: user._id, userName: user.name,
      action: 'Admin password reset via forgot password',
      category: 'admin', req
    });

    res.json({ success: true, message: 'Passwords changed!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
