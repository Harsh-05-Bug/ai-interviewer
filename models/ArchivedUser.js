const mongoose = require('mongoose');

const ArchivedUserSchema = new mongoose.Schema({
  originalId: { type: mongoose.Schema.Types.ObjectId },
  name: String,
  email: String,
  avatar: String,
  phone: String,
  college: String,
  graduationYear: String,
  currentCompany: String,
  github: String,
  linkedin: String,
  bio: String,
  skills: [String],
  location: String,
  joinedAt: Date,
  deletedAt: { type: Date, default: Date.now },
  deletedBy: { type: String, enum: ['admin', 'self'], default: 'admin' },
  totalSessions: { type: Number, default: 0 },
  avgScore: { type: Number, default: 0 },
  bestScore: { type: Number, default: 0 },
  sessions: [{ type: mongoose.Schema.Types.Mixed }],
  posts: [{ type: mongoose.Schema.Types.Mixed }],
  reviews: [{ type: mongoose.Schema.Types.Mixed }],
  notes: [{ type: mongoose.Schema.Types.Mixed }],
  reason: { type: String, default: '' },
});

module.exports = mongoose.model('ArchivedUser', ArchivedUserSchema);