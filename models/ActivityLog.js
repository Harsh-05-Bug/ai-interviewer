const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  userName: { type: String, default: 'System' },
  userEmail: { type: String, default: '' },
  action: { type: String, required: true },
  category: { type: String, enum: ['auth', 'interview', 'forum', 'review', 'studyroom', 'compiler', 'question', 'admin', 'profile', 'other'], default: 'other' },
  details: { type: String, default: '' },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  region: { type: String, default: 'Unknown' },
  createdAt: { type: Date, default: Date.now },
});

ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ category: 1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);