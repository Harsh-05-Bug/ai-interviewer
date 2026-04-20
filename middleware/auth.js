const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'ai_interviewer_super_secret_key_2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(userId) {
  return jwt.sign({ _id: userId.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function setTokenCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, error: 'Authentication required.' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded._id || decoded.id);
    if (!user) return res.status(401).json({ success: false, error: 'User not found.' });

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ success: false, error: 'Your account has been suspended. Contact admin.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
}

module.exports = { generateToken, setTokenCookie, authMiddleware };
