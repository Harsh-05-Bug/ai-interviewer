const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { authMiddleware } = require('../middleware/auth');

// Submit contact message (public)
router.post('/message', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });

    let userId = null;
    try {
      const jwt = require('jsonwebtoken');
      const token = req.cookies?.token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ai_interviewer_super_secret_key_2025');
        userId = decoded.userId;
      }
    } catch {}

    await Contact.create({ name, email, type: 'message', message, userId });
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Submit bug report (public)
router.post('/bug', async (req, res) => {
  try {
    const { name, email, bugTitle, steps, expected } = req.body;
    if (!bugTitle || !steps)
      return res.status(400).json({ success: false, error: 'Bug title and steps are required.' });

    let userId = null;
    try {
      const jwt = require('jsonwebtoken');
      const token = req.cookies?.token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ai_interviewer_super_secret_key_2025');
        userId = decoded.userId;
      }
    } catch {}

    await Contact.create({
      name: name || 'Anonymous',
      email: email || '',
      type: 'bug',
      message: `Bug: ${bugTitle}\n\nSteps: ${steps}\n\nExpected: ${expected}`,
      bugTitle, steps, expected, userId,
    });
    res.json({ success: true, message: 'Bug report submitted!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Get all messages
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(403).json({ success: false, error: 'Admin access required.' });

    const messages = await Contact.find({}).sort({ createdAt: -1 }).limit(100);
    const stats = {
      total: await Contact.countDocuments(),
      new: await Contact.countDocuments({ status: 'new' }),
      read: await Contact.countDocuments({ status: 'read' }),
      resolved: await Contact.countDocuments({ status: 'resolved' }),
      bugs: await Contact.countDocuments({ type: 'bug' }),
    };
    res.json({ success: true, messages, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Update message status
router.put('/admin/:id/status', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(403).json({ success: false, error: 'Admin access required.' });

    const { status } = req.body;
    if (!['new', 'read', 'resolved'].includes(status))
      return res.status(400).json({ success: false, error: 'Invalid status.' });

    const msg = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!msg) return res.status(404).json({ success: false, error: 'Message not found.' });
    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Delete message
router.delete('/admin/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(403).json({ success: false, error: 'Admin access required.' });

    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;