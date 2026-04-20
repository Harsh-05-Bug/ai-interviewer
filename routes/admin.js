const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const { adminAuth, ADMIN_PASSWORD } = require('../middleware/admin');

// Admin login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: Buffer.from(ADMIN_PASSWORD).toString('base64') });
  } else {
    res.status(401).json({ success: false, error: 'Wrong password.' });
  }
});

// Get all sessions
router.get('/sessions', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const sessions = await Session.find(filter)
      .select('sessionId config report status startedAt completedAt questionCount')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    const total = await Session.countDocuments(filter);
    res.json({ success: true, sessions, total });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalSessions = await Session.countDocuments();
    const completed = await Session.countDocuments({ status: 'completed' });
    const inProgress = await Session.countDocuments({ status: 'in_progress' });
    const abandoned = await Session.countDocuments({ status: 'abandoned' });
    const verdictStats = await Session.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$report.verdict', count: { $sum: 1 } } },
    ]);
    const avgScore = await Session.aggregate([
      { $match: { status: 'completed', 'report.overallScore': { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$report.overallScore' } } },
    ]);
    const roleStats = await Session.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$config.role', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);
    const dailyStats = await Session.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({
      success: true,
      stats: { totalSessions, completed, inProgress, abandoned, averageScore: avgScore[0]?.avg?.toFixed(1) || 0, verdictBreakdown: verdictStats, topRoles: roleStats, dailyStats },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete session
router.delete('/session/:sessionId', adminAuth, async (req, res) => {
  try {
    await Session.findOneAndDelete({ sessionId: req.params.sessionId });
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;