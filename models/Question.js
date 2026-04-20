const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  topic: {
    type: String,
    required: true,
    enum: [
      'Arrays', 'Strings', 'Linked Lists', 'Stacks & Queues',
      'Trees', 'Graphs', 'Dynamic Programming', 'Recursion',
      'Sorting & Searching', 'Hashing', 'Heaps',
      'System Design', 'OS', 'DBMS', 'Networks', 'OOP', 'Custom',
      'API Design', 'Databases', 'Distributed Systems', 'Networking',
      'Security', 'Architecture', 'Performance', 'DevOps',
      'Binary Search', 'Backtracking', 'Greedy', 'Bit Manipulation',
      'Conflict Resolution', 'Leadership', 'Time Management',
      'Growth Mindset', 'Motivation', 'Problem Solving',
    ]
  },
  type: { type: String, enum: ['coding', 'theory', 'dsa', 'system', 'technical', 'behavioral'], default: 'coding' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [{ type: String, trim: true }],
  examples: [{ input: String, output: String, explanation: String }],
  constraints: [String],
  hints: [String],
  companies: [String],
  leetcodeLink: { type: String, default: '' },
  solution: { type: String, default: '' },
  answer: { type: String, default: '' },
  customTopic: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

QuestionSchema.index({ title: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('Question', QuestionSchema);