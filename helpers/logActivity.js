const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ userId, userName, userEmail, action, category, details, req }) => {
  try {
    const ip = req ? (req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.ip || '') : '';
    const userAgent = req ? (req.headers['user-agent'] || '') : '';

    await ActivityLog.create({
      userId: userId || null,
      userName: userName || 'System',
      userEmail: userEmail || '',
      action,
      category: category || 'other',
      details: details || '',
      ip: ip.split(',')[0].trim(),
      userAgent,
    });
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

module.exports = logActivity;