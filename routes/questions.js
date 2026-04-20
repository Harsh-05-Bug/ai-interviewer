const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { authMiddleware } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// ✅ GET topic stats — MUST be before /:id
router.get('/meta/stats', async (req, res) => {
  try {
    const stats = await Question.aggregate([
      {
        $group: {
          _id: '$topic', count: { $sum: 1 },
          easy: { $sum: { $cond: [{ $eq: ['$difficulty', 'Easy'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$difficulty', 'Medium'] }, 1, 0] } },
          hard: { $sum: { $cond: [{ $eq: ['$difficulty', 'Hard'] }, 1, 0] } },
        }
      },
      { $sort: { count: -1 } }
    ]);
    res.json(stats);
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all questions (with filters)
router.get('/', async (req, res) => {
  try {
    const { topic, difficulty, search, company, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (topic && topic !== 'All') filter.topic = topic;
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
    if (company && company !== 'All') filter.companies = { $in: [company] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { companies: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .select('title topic difficulty tags companies leetcodeLink type createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ questions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Questions error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET single question
router.get('/:id', async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Not found' });
    res.json(q);
  } catch (err) {
    console.error('Single question error:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST create question (admin only)
router.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update question (admin only)
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!question) return res.status(404).json({ message: 'Not found' });
    res.json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE question (admin only)
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;