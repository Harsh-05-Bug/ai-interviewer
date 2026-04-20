const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isGlobal: { type: Boolean, default: false },
  title: { type: String, required: true, maxLength: 100 },
  message: { type: String, required: true, maxLength: 500 },
  type: { type: String, enum: ['info', 'warning', 'success', 'alert', 'personal'], default: 'info' },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sentBy: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);