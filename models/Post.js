const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: null },
  content: { type: String, required: true, maxLength: 2000 },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: null },
  title: { type: String, required: true, trim: true, maxLength: 200 },
  content: { type: String, required: true, maxLength: 5000 },
  category: { type: String, enum: ['DSA', 'System Design', 'Behavioral', 'Career', 'Resume', 'Experience', 'Resources', 'General'], default: 'General' },
  tags: [{ type: String, trim: true }],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema],
  views: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

PostSchema.index({ createdAt: -1 });
PostSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);