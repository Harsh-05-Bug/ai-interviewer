module.exports = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated.' });
  if (!req.user.isAdmin) return res.status(403).json({ success: false, error: 'Admin only.' });
  next();
};