const mongoose = require('mongoose');

const FeatureToggleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
});

const AdminConfigSchema = new mongoose.Schema({
  secretCode: { type: String, required: true },
  adminUsername: { type: String, default: null },
  adminPass1: { type: String, default: null },
  adminPass2: { type: String, default: null },
  otpCode: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  features: [FeatureToggleSchema],
  failedLoginAttempts: { type: Number, default: 0 },
  loginLockedUntil: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AdminConfig', AdminConfigSchema);