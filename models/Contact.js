const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, enum: ['message', 'bug'], default: 'message' },
  message: { type: String, required: true },
  // Bug-specific fields
  bugTitle: { type: String, default: '' },
  steps: { type: String, default: '' },
  expected: { type: String, default: '' },
  // Status
  status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
});

ContactSchema.index({ createdAt: -1 });
module.exports = mongoose.model('Contact', ContactSchema);