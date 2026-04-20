const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: null },
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  experience: { type: String, enum: ['Fresher', 'Junior', 'Mid', 'Senior', 'Staff+'], required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Very Hard'], required: true },
  result: { type: String, enum: ['Selected', 'Rejected', 'Ghosted', 'Pending', 'Withdrew'], required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  rounds: { type: Number, min: 1, max: 10, default: 3 },
  description: { type: String, required: true, maxLength: 2000 },
  tips: { type: String, default: '', maxLength: 1000 },
  interviewDate: { type: Date, default: Date.now },
  tags: [{ type: String, trim: true }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isAnonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

ReviewSchema.index({ company: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1 });

module.exports = mongoose.model('Review', ReviewSchema);