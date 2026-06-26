import mongoose from 'mongoose';

const codingQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  category: { type: String, required: true },
  problemStatement: { type: String, required: true },
  constraints: [String],
  sampleInput: { type: String },
  sampleOutput: { type: String },
  hints: [String],
  expectedConcepts: [String],
}, { _id: false });

const codingEvaluationSchema = new mongoose.Schema({
  overallScore: { type: Number, min: 0, max: 100 },
  correctness: { type: Number, min: 0, max: 10 },
  complexity: { type: Number, min: 0, max: 10 },
  readability: { type: Number, min: 0, max: 10 },
  edgeCases: { type: Number, min: 0, max: 10 },
  communication: { type: Number, min: 0, max: 10 },
  strengths: [String],
  weaknesses: [String],
  recommendedImprovements: [String],
  idealApproach: { type: String },
  timeComplexity: { type: String },
  spaceComplexity: { type: String },
}, { _id: false });

const codingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active',
  },
  config: {
    language: { type: String, enum: ['java', 'python', 'javascript'], required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    topic: { type: String, required: true },
  },
  question: { type: codingQuestionSchema, required: true },
  
  submittedCode: { type: String },
  hintsUsed: { type: Number, default: 0 },
  executionOutput: { type: String },
  
  evaluation: { type: codingEvaluationSchema, default: null },
  
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
}, {
  timestamps: true,
});

const CodingSession = mongoose.model('CodingSession', codingSessionSchema);

export default CodingSession;
