const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: null },
  content: { type: String, required: true, maxLength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

const MemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: null },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  joinedAt: { type: Date, default: Date.now },
});

const SharedQuestionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  title: { type: String },
  topic: { type: String },
  difficulty: { type: String },
  addedBy: { type: String },
  addedAt: { type: Date, default: Date.now },
});

const StudyGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxLength: 60 },
  description: { type: String, trim: true, maxLength: 300 },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [MemberSchema],
  maxMembers: { type: Number, default: 10, min: 2, max: 50 },
  topic: { type: String, enum: ['DSA', 'System Design', 'Behavioral', 'Career', 'Frontend', 'Backend', 'Full Stack', 'DevOps', 'ML/AI', 'General'], default: 'General' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Mixed'], default: 'Mixed' },
  isPrivate: { type: Boolean, default: false },
  joinCode: { type: String, default: null },
  messages: [MessageSchema],
  sharedQuestions: [SharedQuestionSchema],
  tags: [{ type: String, trim: true }],
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  chatLocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

StudyGroupSchema.index({ status: 1, createdAt: -1 });
StudyGroupSchema.index({ 'members.userId': 1 });

module.exports = mongoose.model('StudyGroup', StudyGroupSchema);