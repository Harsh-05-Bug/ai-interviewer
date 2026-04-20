const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken, setTokenCookie, authMiddleware } = require('../middleware/auth');
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require('../helpers/email');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '798913266374-70oa331fgn3puu6ndqs0shlqored5on8.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, referral } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    if (password.length < 6)
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });

    const existing = await User.findOne({ email });
    if (existing && existing.isVerified)
      return res.status(400).json({ success: false, error: 'Email already registered.' });
    if (existing && !existing.isVerified)
      await User.deleteOne({ _id: existing._id });

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Generate unique referral code
    const referralCode = name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '').slice(0, 5) + Math.random().toString(36).slice(2, 7);

    // Check if referred by someone
    let referredByUser = null;
    if (referral) {
      referredByUser = await User.findOne({ referralCode: referral });
    }

    const user = await User.create({
      name, email, password: hashedPassword,
      isVerified: false, verificationToken, verificationExpires,
      referralCode, referredBy: referredByUser?._id || null,
    });

    // Credit the referrer
    if (referredByUser) {
      referredByUser.referrals.push(user._id);
      referredByUser.referralRewards = (referredByUser.referralRewards || 0) + 1;
      await referredByUser.save();
    }

    try { await sendVerificationEmail(email, name, verificationToken); }
    catch (emailErr) { console.error('Failed to send verification email:', emailErr.message); }

    res.status(201).json({
      success: true, needsVerification: true,
      message: 'Account created! Please check your email to verify.',
      user: { id: user._id, name: user.name, email: user.email, isVerified: false }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify email
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ success: false, error: 'Verification token required.' });

    const user = await User.findOne({ verificationToken: token, verificationExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ success: false, error: 'Invalid or expired verification link.' });

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationExpires = null;
    await user.save();

    try { await sendWelcomeEmail(user.email, user.name); } catch {}

    const authToken = generateToken(user._id);
    setTokenCookie(res, authToken);

    res.json({
      success: true, message: 'Email verified successfully!',
      user: { id: user._id, name: user.name, email: user.email, isVerified: true, profileCompleted: user.profileCompleted, isAdmin: user.isAdmin }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Resend verification
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email required.' });

    const user = await User.findOne({ email, isVerified: false });
    if (!user) return res.status(400).json({ success: false, error: 'No unverified account found.' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, user.name, verificationToken);
    res.json({ success: true, message: 'Verification email sent!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password required.' });

    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(400).json({ success: false, error: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, error: 'Invalid email or password.' });

    if (!user.isVerified)
      return res.status(403).json({ success: false, error: 'Please verify your email before logging in.', needsVerification: true, email: user.email });

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, profileCompleted: user.profileCompleted, isAdmin: user.isAdmin, isVerified: true }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ success: false, error: 'Google credential required.' });

    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (user) {
      if (!user.googleId) { user.googleId = googleId; user.isVerified = true; await user.save(); }
    } else {
      const referralCode = name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '').slice(0, 5) + Math.random().toString(36).slice(2, 7);
      user = await User.create({ name, email, googleId, avatar: picture, isVerified: true, referralCode });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, profileCompleted: user.profileCompleted, isAdmin: user.isAdmin, isVerified: true }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id, name: req.user.name, email: req.user.email,
      avatar: req.user.avatar, profileCompleted: req.user.profileCompleted,
      isAdmin: req.user.isAdmin, isVerified: req.user.isVerified,
    }
  });
});

// Get full profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -verificationToken -resetPasswordToken');
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, college, graduationYear, currentCompany, github, linkedin, bio, skills, location } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (college !== undefined) updates.college = college;
    if (graduationYear !== undefined) updates.graduationYear = graduationYear;
    if (currentCompany !== undefined) updates.currentCompany = currentCompany;
    if (github !== undefined) updates.github = github;
    if (linkedin !== undefined) updates.linkedin = linkedin;
    if (bio !== undefined) updates.bio = bio;
    if (skills !== undefined) updates.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
    if (location !== undefined) updates.location = location;
    if (req.body.showOnLeaderboard !== undefined) updates.showOnLeaderboard = req.body.showOnLeaderboard;
    if (req.body.displayName !== undefined) updates.displayName = req.body.displayName;
    if (req.body.useRealName !== undefined) updates.useRealName = req.body.useRealName;
    if (req.body.isPublicProfile !== undefined) updates.isPublicProfile = req.body.isPublicProfile;

    if (req.body.username !== undefined) {
      const uname = req.body.username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
      if (uname.length < 3) return res.status(400).json({ success: false, error: 'Username must be at least 3 characters.' });
      if (uname.length > 30) return res.status(400).json({ success: false, error: 'Username must be 30 characters or less.' });
      const existing = await User.findOne({ username: uname, _id: { $ne: req.user._id } });
      if (existing) return res.status(400).json({ success: false, error: 'Username already taken.' });
      updates.username = uname;
    }

    updates.profileCompleted = true;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password -verificationToken -resetPasswordToken');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Check username
router.get('/check-username/:username', async (req, res) => {
  try {
    const uname = req.params.username.toLowerCase().trim();
    if (uname.length < 3) return res.json({ success: true, available: false, error: 'Too short.' });
    const existing = await User.findOne({ username: uname });
    res.json({ success: true, available: !existing });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Public profile
router.get('/u/:username', async (req, res) => {
  try {
    const Session = require('../models/Session');
    const uname = req.params.username.toLowerCase().trim();
    const user = await User.findOne({ username: uname, isPublicProfile: true, isVerified: true })
      .select('name username avatar bio skills location college currentCompany github linkedin graduationYear badges createdAt').lean();
    if (!user) return res.status(404).json({ success: false, error: 'Profile not found.' });

    const sessions = await Session.find({ userId: user._id, status: 'completed', 'report.overallScore': { $gt: 0 } })
      .select('report.overallScore report.verdict config.type config.difficulty config.role startedAt').sort({ startedAt: -1 }).lean();

    const scores = sessions.map(s => s.report.overallScore);
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const selectedCount = sessions.filter(s => s.report?.verdict?.toLowerCase().includes('selected')).length;

    const BADGE_DEFS = { first_interview:{name:'First Steps',emoji:'🎯'}, five_interviews:{name:'Getting Serious',emoji:'🔥'}, ten_interviews:{name:'Dedicated',emoji:'💪'}, score_70:{name:'Rising Star',emoji:'⭐'}, score_80:{name:'High Performer',emoji:'🌟'}, score_90:{name:'90+ Club',emoji:'💎'}, perfect_score:{name:'Perfectionist',emoji:'🏆'}, first_selected:{name:'Selected!',emoji:'✅'}, streak_3:{name:'On Fire',emoji:'🔥'}, streak_7:{name:'Week Warrior',emoji:'⚡'}, hard_mode:{name:'Fearless',emoji:'😈'}, night_owl:{name:'Night Owl',emoji:'🦉'}, profile_done:{name:'Identity',emoji:'🪪'}, leaderboard:{name:'Competitor',emoji:'🏆'} };
    const earnedBadges = (user.badges || []).map(b => ({ id: b.id, name: BADGE_DEFS[b.id]?.name || b.id, emoji: BADGE_DEFS[b.id]?.emoji || '🏅', earnedAt: b.earnedAt }));

    res.json({ success: true, profile: { name: user.name, username: user.username, avatar: user.avatar, bio: user.bio, skills: user.skills, location: user.location, college: user.college, currentCompany: user.currentCompany, github: user.github, linkedin: user.linkedin, graduationYear: user.graduationYear, joinedAt: user.createdAt, stats: { totalSessions: sessions.length, bestScore, avgScore, selectedCount }, badges: earnedBadges } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Notes CRUD
router.get('/notes', authMiddleware, async (req, res) => { try { const user = await User.findById(req.user._id).select('notes'); res.json({ success: true, notes: user.notes || [] }); } catch (err) { res.status(500).json({ success: false, error: err.message }); } });
router.post('/notes', authMiddleware, async (req, res) => { try { const { content } = req.body; if (!content) return res.status(400).json({ success: false, error: 'Note content required.' }); const user = await User.findById(req.user._id); user.notes.push({ content }); await user.save(); res.json({ success: true, notes: user.notes }); } catch (err) { res.status(500).json({ success: false, error: err.message }); } });
router.put('/notes/:noteId', authMiddleware, async (req, res) => { try { const { content } = req.body; const user = await User.findById(req.user._id); const note = user.notes.id(req.params.noteId); if (!note) return res.status(404).json({ success: false, error: 'Note not found.' }); note.content = content; note.updatedAt = new Date(); await user.save(); res.json({ success: true, notes: user.notes }); } catch (err) { res.status(500).json({ success: false, error: err.message }); } });
router.delete('/notes/:noteId', authMiddleware, async (req, res) => { try { const user = await User.findById(req.user._id); user.notes = user.notes.filter(n => n._id.toString() !== req.params.noteId); await user.save(); res.json({ success: true, notes: user.notes }); } catch (err) { res.status(500).json({ success: false, error: err.message }); } });

// Toggle bookmark question
router.post('/bookmark/question/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const qId = req.params.id;
    if (!user.bookmarks) user.bookmarks = { questions: [], posts: [] };
    const idx = (user.bookmarks.questions || []).findIndex(id => id.toString() === qId);
    if (idx > -1) user.bookmarks.questions.splice(idx, 1);
    else user.bookmarks.questions.push(qId);
    await user.save();
    res.json({ success: true, bookmarked: idx === -1, bookmarks: user.bookmarks.questions });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Toggle bookmark post
router.post('/bookmark/post/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pId = req.params.id;
    if (!user.bookmarks) user.bookmarks = { questions: [], posts: [] };
    const idx = (user.bookmarks.posts || []).findIndex(id => id.toString() === pId);
    if (idx > -1) user.bookmarks.posts.splice(idx, 1);
    else user.bookmarks.posts.push(pId);
    await user.save();
    res.json({ success: true, bookmarked: idx === -1, bookmarks: user.bookmarks.posts });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Get all bookmarks
router.get('/bookmarks', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('bookmarks.questions')
      .populate({ path: 'bookmarks.posts', populate: { path: 'userId', select: 'name avatar' } });
    res.json({ success: true, questions: user.bookmarks?.questions || [], posts: user.bookmarks?.posts || [] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Get referral info
router.get('/referral', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('referrals', 'name avatar createdAt')
      .populate('referredBy', 'name');
    if (!user.referralCode) {
      user.referralCode = user.name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '').slice(0, 5) + Math.random().toString(36).slice(2, 7);
      await user.save();
    }
    res.json({
      success: true, referralCode: user.referralCode,
      referralLink: `${process.env.CLIENT_URL || 'http://localhost:3000'}/signup?ref=${user.referralCode}`,
      referrals: user.referrals || [], totalReferrals: user.referrals?.length || 0,
      rewards: user.referralRewards || 0, referredBy: user.referredBy?.name || null,
    });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ success: false, error: 'Current and new password required.' });
    if (newPassword.length < 6) return res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });
    const user = await User.findById(req.user._id);
    if (!user.password) return res.status(400).json({ success: false, error: 'Account uses Google login.' });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, error: 'Current password is incorrect.' });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Delete own account
router.delete('/delete-account', authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id);
    if (user.isAdmin) return res.status(400).json({ success: false, error: 'Admin account cannot be deleted.' });
    if (user.password) {
      if (!password) return res.status(400).json({ success: false, error: 'Password required.' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ success: false, error: 'Incorrect password.' });
    }
    const Session = require('../models/Session');
    await Session.deleteMany({ userId: user._id });
    const Contact = require('../models/Contact');
    await Contact.deleteMany({ userId: user._id });
    await User.deleteOne({ _id: user._id });
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' });
    res.json({ success: true, message: 'Account deleted.' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email required.' });
    const user = await User.findOne({ email, isVerified: true });
    if (!user) return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    if (!user.password && user.googleId) return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    try { await sendPasswordResetEmail(email, user.name, resetToken); } catch (emailErr) { console.error('Failed:', emailErr.message); return res.status(500).json({ success: false, error: 'Failed to send email.' }); }
    res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ success: false, error: 'Token and new password required.' });
    if (password.length < 6) return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ success: false, error: 'Invalid or expired reset link.' });
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully!' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const Session = require('../models/Session');
    const users = await User.find({ showOnLeaderboard: true, isVerified: true }).select('name displayName useRealName avatar college currentCompany skills createdAt').lean();
    if (users.length === 0) return res.json({ success: true, leaderboard: [] });
    const leaderboard = await Promise.all(users.map(async (u) => {
      const sessions = await Session.find({ userId: u._id, status: 'completed', 'report.overallScore': { $gt: 0 } }).select('report.overallScore report.verdict config.role startedAt').sort({ 'report.overallScore': -1 }).lean();
      if (sessions.length === 0) return null;
      const scores = sessions.map(s => s.report.overallScore);
      return { id: u._id, name: u.useRealName ? u.name : (u.displayName || u.name.split(' ')[0]), avatar: u.avatar, college: u.college || '', company: u.currentCompany || '', skills: u.skills?.slice(0, 3) || [], bestScore: Math.max(...scores), avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), totalSessions: sessions.length, selectedCount: sessions.filter(s => s.report?.verdict?.toLowerCase().includes('selected')).length, topRole: sessions[0]?.config?.role || '', joinedAt: u.createdAt };
    }));
    res.json({ success: true, leaderboard: leaderboard.filter(Boolean).sort((a, b) => b.bestScore - a.bestScore || b.avgScore - a.avgScore) });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Badges
router.get('/badges', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const Session = require('../models/Session');
    const sessions = await Session.find({ userId: user._id, status: 'completed' }).select('report config startedAt').sort({ startedAt: 1 }).lean();
    const totalCompleted = sessions.length;
    const scores = sessions.map(s => s.report?.overallScore || 0).filter(s => s > 0);
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const selectedCount = sessions.filter(s => s.report?.verdict?.toLowerCase().includes('selected')).length;
    const types = [...new Set(sessions.map(s => s.config?.type).filter(Boolean))];
    const hardCount = sessions.map(s => s.config?.difficulty).filter(d => d === 'Hard' || d === 'FAANG-level').length;
    let maxStreak = 0, currentStreak = 0, lastDate = null;
    sessions.forEach(s => { const date = new Date(s.startedAt).toDateString(); if (date === lastDate) return; if (lastDate) { const diff = (new Date(date) - new Date(lastDate)) / (1000*60*60*24); if (diff <= 1) currentStreak++; else currentStreak = 1; } else currentStreak = 1; if (currentStreak > maxStreak) maxStreak = currentStreak; lastDate = date; });
    const nightSessions = sessions.filter(s => { const h = new Date(s.startedAt).getHours(); return h >= 22 || h < 5; }).length;
    const perfectCount = scores.filter(s => s >= 100).length;

    const BADGES = [
      { id: 'first_interview', name: 'First Steps', desc: 'Complete your first interview', emoji: '🎯', check: () => totalCompleted >= 1 },
      { id: 'five_interviews', name: 'Getting Serious', desc: 'Complete 5 interviews', emoji: '🔥', check: () => totalCompleted >= 5 },
      { id: 'ten_interviews', name: 'Dedicated', desc: 'Complete 10 interviews', emoji: '💪', check: () => totalCompleted >= 10 },
      { id: 'twenty_five', name: 'Interview Machine', desc: 'Complete 25 interviews', emoji: '🚀', check: () => totalCompleted >= 25 },
      { id: 'fifty_interviews', name: 'Legend', desc: 'Complete 50 interviews', emoji: '👑', check: () => totalCompleted >= 50 },
      { id: 'score_70', name: 'Rising Star', desc: 'Score 70+', emoji: '⭐', check: () => bestScore >= 70 },
      { id: 'score_80', name: 'High Performer', desc: 'Score 80+', emoji: '🌟', check: () => bestScore >= 80 },
      { id: 'score_90', name: '90+ Club', desc: 'Score 90+', emoji: '💎', check: () => bestScore >= 90 },
      { id: 'perfect_score', name: 'Perfectionist', desc: 'Score 100', emoji: '🏆', check: () => perfectCount >= 1 },
      { id: 'first_selected', name: 'Selected!', desc: 'Get Selected', emoji: '✅', check: () => selectedCount >= 1 },
      { id: 'five_selected', name: 'Hiring Magnet', desc: 'Selected 5 times', emoji: '🧲', check: () => selectedCount >= 5 },
      { id: 'streak_3', name: 'On Fire', desc: '3-day streak', emoji: '🔥', check: () => maxStreak >= 3 },
      { id: 'streak_7', name: 'Week Warrior', desc: '7-day streak', emoji: '⚡', check: () => maxStreak >= 7 },
      { id: 'streak_14', name: 'Unstoppable', desc: '14-day streak', emoji: '🏅', check: () => maxStreak >= 14 },
      { id: 'streak_30', name: 'Iron Will', desc: '30-day streak', emoji: '🗿', check: () => maxStreak >= 30 },
      { id: 'all_types', name: 'Well Rounded', desc: 'Try all types', emoji: '🎭', check: () => types.length >= 5 },
      { id: 'hard_mode', name: 'Fearless', desc: 'Complete Hard', emoji: '😈', check: () => hardCount >= 1 },
      { id: 'hard_five', name: 'FAANG Ready', desc: '5 Hard interviews', emoji: '🎖️', check: () => hardCount >= 5 },
      { id: 'night_owl', name: 'Night Owl', desc: 'Practice after 10 PM', emoji: '🦉', check: () => nightSessions >= 1 },
      { id: 'avg_80', name: 'Consistent', desc: '80+ avg', emoji: '📊', check: () => avgScore >= 80 && totalCompleted >= 3 },
      { id: 'profile_done', name: 'Identity', desc: 'Complete profile', emoji: '🪪', check: () => user.profileCompleted },
      { id: 'resume_upload', name: 'Resume Ready', desc: 'Upload resume', emoji: '📄', check: () => sessions.some(s => s.config?.hasResume) },
      { id: 'leaderboard', name: 'Competitor', desc: 'Join leaderboard', emoji: '🏆', check: () => user.showOnLeaderboard },
    ];

    const existingIds = new Set((user.badges || []).map(b => b.id));
    const newBadges = [];
    BADGES.forEach(badge => { if (!existingIds.has(badge.id) && badge.check()) newBadges.push({ id: badge.id }); });
    if (newBadges.length > 0) { user.badges = [...(user.badges || []), ...newBadges]; await user.save(); }
    const earnedIds = new Set((user.badges || []).map(b => b.id));
    const allBadges = BADGES.map(b => ({ id: b.id, name: b.name, desc: b.desc, emoji: b.emoji, earned: earnedIds.has(b.id), earnedAt: (user.badges || []).find(ub => ub.id === b.id)?.earnedAt || null }));
    res.json({ success: true, badges: allBadges, earned: allBadges.filter(b => b.earned).length, total: allBadges.length, newBadges: newBadges.map(nb => BADGES.find(b => b.id === nb.id)).filter(Boolean) });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' });
  res.json({ success: true, message: 'Logged out.' });
});

// Admin Login
router.post('/admin-login', async (req, res) => {
  try {
    const { username, pass1, pass2 } = req.body;
    if (!username || !pass1 || !pass2) return res.status(400).json({ success: false, error: 'Username and both passwords are required.' });
    const AdminConfig = require('../models/AdminConfig');
    const config = await AdminConfig.findOne();
    const envUser = process.env.ADMIN_USERNAME || 'subway@6985';
    const envPass1 = process.env.ADMIN_PASSWORD1 || 'admin123';
    const envPass2 = process.env.ADMIN_PASSWORD2 || 'admin456';
    const checkUser = config?.adminUsername || envUser;
    const checkPass1 = config?.adminPass1 || envPass1;
    const checkPass2 = config?.adminPass2 || envPass2;
    if (username !== checkUser || pass1 !== checkPass1 || pass2 !== checkPass2) return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    const user = await User.findOne({ isAdmin: true });
    if (!user) return res.status(401).json({ success: false, error: 'Admin account not found.' });
    const token = generateToken(user._id);
    setTokenCookie(res, token);
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, isAdmin: true } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Admin: Get all users
router.get('/admin/users', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ success: false, error: 'Admin access required.' });
    const users = await User.find({}).select('-password -verificationToken -resetPasswordToken').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Admin: Delete user
router.delete('/admin/users/:userId', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ success: false, error: 'Admin access required.' });
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    if (user.isAdmin) return res.status(400).json({ success: false, error: 'Cannot delete admin.' });
    await User.deleteOne({ _id: req.params.userId });
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
