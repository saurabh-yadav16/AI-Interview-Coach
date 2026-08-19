const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  score: { type: Number, required: true, min: 0, max: 10 },
  correctness: { type: Number, default: 0, min: 0, max: 10 },
  technicalAccuracy: { type: Number, default: 0, min: 0, max: 10 },
  completeness: { type: Number, default: 0, min: 0, max: 10 },
  relevance: { type: Number, default: 0, min: 0, max: 10 },
  clarity: { type: Number, default: 0, min: 0, max: 10 },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  missingConcepts: [{ type: String }],
  feedback: { type: String, default: '' },
  idealAnswer: { type: String, default: '' },
  evaluatedAt: { type: Date, default: Date.now },
});

const questionAnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  order: { type: Number, required: true },
  category: { type: String, default: 'Technical' },
  questionText: { type: String, required: true },
  expectedConcepts: [{ type: String }],
  difficulty: { type: String, default: 'Medium' },
  userAnswer: { type: String, default: '' },
  submittedAt: { type: Date },
  evaluation: { type: evaluationSchema, default: null },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    role: { type: String, required: true },
    company: { type: String, default: 'General Tech' },
    interviewType: { type: String, default: 'Technical' },
    difficulty: { type: String, default: 'Medium' },
    totalQuestionsCount: { type: Number, default: 5 },
    currentQuestionIndex: { type: Number, default: 0 },
    askedQuestionIds: [{ type: String }],
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    questions: [questionAnswerSchema],
    finalScore: { type: Number, default: 0 },
    summaryFeedback: { type: String, default: '' },
    weakAreas: [{ type: String }],
    strongAreas: [{ type: String }],
    durationSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);
