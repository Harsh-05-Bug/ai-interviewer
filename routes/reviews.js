const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Get all reviews (with filters)
router.get('/', async (req, res) => {
  try {
    const { company, difficulty, result, sort = 'newest', page = 1, limit = 15 } = req.query;
    const filter = {};
    if (company && company !== 'All') filter.company = { $regex: company, $options: 'i' };
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
    if (result && result !== 'All') filter.result = result;

    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    if (sort === 'rating') sortObj = { rating: -1, createdAt: -1 };
    if (sort === 'popular') sortObj = { 'likes.length': -1, createdAt: -1 };

    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .sort(sortObj)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    // Hide name if anonymous
    const sanitized = reviews.map(r => ({
      ...r,
      userName: r.isAnonymous ? 'Anonymous' : r.userName,
      userAvatar: r.isAnonymous ? null : r.userAvatar,
      userId: r.isAnonymous ? null : r.userId,
      likeCount: r.likes?.length || 0,
    }));

    res.json({ success: true, reviews: sanitized, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get company stats
router.get('/companies', async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $group: {
        _id: '$company',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        avgDifficulty: { $push: '$difficulty' },
        selected: { $sum: { $cond: [{ $eq: ['$result', 'Selected'] }, 1, 0] } },
      }},
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    const companies = stats.map(s => ({
      name: s._id,
      reviews: s.count,
      avgRating: Math.round(s.avgRating * 10) / 10,
      selectRate: s.count > 0 ? Math.round((s.selected / s.count) * 100) : 0,
    }));

    res.json({ success: true, companies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Post a review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { company, role, experience, difficulty, result, rating, rounds, description, tips, tags, isAnonymous, interviewDate } = req.body;

    if (!company || !role || !experience || !difficulty || !result || !rating || !description) {
      return res.status(400).json({ success: false, error: 'All required fields must be filled.' });
    }

    if (description.length < 20) {
      return res.status(400).json({ success: false, error: 'Description must be at least 20 characters.' });
    }

    const user = await User.findById(req.user._id);

    const review = await Review.create({
      userId: user._id,
      userName: user.name,
      userAvatar: user.avatar,
      company: company.trim(),
      role: role.trim(),
      experience, difficulty, result,
      rating: Math.min(5, Math.max(1, parseInt(rating))),
      rounds: Math.min(10, Math.max(1, parseInt(rounds) || 3)),
      description: description.trim(),
      tips: tips?.trim() || '',
      tags: tags || [],
      isAnonymous: !!isAnonymous,
      interviewDate: interviewDate || new Date(),
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Like/unlike a review
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: 'Review not found.' });

    const userId = req.user._id;
    const liked = review.likes.includes(userId);

    if (liked) {
      review.likes = review.likes.filter(id => id.toString() !== userId.toString());
    } else {
      review.likes.push(userId);
    }

    await review.save();
    res.json({ success: true, liked: !liked, likeCount: review.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete own review
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: 'Review not found.' });

    if (review.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    }

    await Review.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;