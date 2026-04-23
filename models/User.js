const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BadgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, default: null },
  googleId: { type: String, default: null },
  avatar: { type: String, default: null },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },

  // Email verification
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  verificationExpires: { type: Date, default: null },

  // Password reset
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },

  // Profile fields
  phone: { type: String, default: '' },
  college: { type: String, default: '' },
  graduationYear: { type: String, default: '' },
  currentCompany: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  location: { type: String, default: '' },
  profileCompleted: { type: Boolean, default: false },

  // Public profile
  username: { type: String, default: null },
  displayName: { type: String, default: '' },
  useRealName: { type: Boolean, default: true },
  isPublicProfile: { type: Boolean, default: false },
  showOnLeaderboard: { type: Boolean, default: false },

  // Badges
  badges: [BadgeSchema],

  // Notes
  notes: [NoteSchema],

  // Bookmarks
  bookmarks: {
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  },

  // Referrals
  referralCode: { type: String, default: null },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  referralRewards: { type: Number, default: 0 },

  // Guest tracking
  guestSessionCount: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
