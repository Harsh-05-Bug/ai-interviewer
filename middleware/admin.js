const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || Buffer.from(token, 'base64').toString() !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }
  next();
}

module.exports = { adminAuth, ADMIN_PASSWORD };