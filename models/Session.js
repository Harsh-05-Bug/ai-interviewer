const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ReportSchema = new mongoose.Schema({
  overallScore: { type: Number, min: 0, max: 100 },
  technicalScore: { type: Number, min: 0, max: 100 },
  problemSolvingScore: { type: Number, min: 0, max: 100 },
  communicationScore: { type: Number, min: 0, max: 100 },
  confidenceScore: { type: Number, min: 0, max: 100 },
  strengths: String,
  weaknesses: String,
  technicalGaps: String,
  communication: String,
  confidence: String,
  improvements: String,
  verdict: { type: String, enum: ['Selected', 'Borderline', 'Rejected'] },
  idealAnswers: [String],
  totalTime: String,
});

const SessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    config: {
      role: { type: String, required: true },
      experience: { type: String, required: true },
      difficulty: { type: String, required: true },
      type: { type: String, required: true },
      questions: { type: Number, required: true },
      hasResume: { type: Boolean, default: false },
    },
    history: [MessageSchema],
    questionCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    report: { type: ReportSchema, default: null },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

SessionSchema.index({ createdAt: -1 });
module.exports = mongoose.model('Session', SessionSchema);