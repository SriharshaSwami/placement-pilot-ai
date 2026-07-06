import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  communicationScore: { type: Number, min: 0, max: 10 },
  technicalAccuracy: { type: Number, min: 0, max: 10 },
  confidence: { type: Number, min: 0, max: 10 },
  completeness: { type: Number, min: 0, max: 10 },
  strengths: [String],
  weaknesses: [String],
  idealAnswer: String,
  improvementSuggestions: [String],
  criticalMistakes: [String],
  hiringSignals: [String],
}, { _id: false });

const interviewQuestionSchema = new mongoose.Schema({
  sequenceNumber: { type: Number, required: true },
  questionText: { type: String, required: true },
  isFollowUp: { type: Boolean, default: false },
  candidateAnswer: { type: String, default: null },
  evaluation: { type: evaluationSchema, default: null },
}, { _id: false });

const interviewSummarySchema = new mongoose.Schema({
  overallScore: { type: Number, min: 0, max: 100 },
  communicationScore: { type: Number, min: 0, max: 100 },
  technicalKnowledge: { type: Number, min: 0, max: 100 },
  confidence: { type: Number, min: 0, max: 100 },
  problemSolving: { type: Number, min: 0, max: 100 },
  resumeAlignment: { type: Number, min: 0, max: 100 },
  behavioralSkills: { type: Number, min: 0, max: 100 },
  
  overallPerformance: String,
  topStrengths: [String],
  weakestAreas: [String],
  topicsToStudy: [String],
  resumeIssuesObserved: [String],
  interviewReadiness: String,
  personalizedRecommendations: [String],
  learningRoadmap: [String],
  criticalMistakes: [String],
  hiringSignals: [String],
  redFlags: [String],
  excellentAnswers: [String],
  missedOpportunities: [String],
}, { _id: false });

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  },
  
  config: {
    type: { type: String, enum: ['HR', 'Technical', 'Behavioral', 'DSA', 'System Design', 'Mixed'], required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    duration: { type: Number, required: true }, // in minutes
    persona: { type: String, default: 'Friendly Campus Recruiter' },
  },
  
  status: { type: String, enum: ['Draft', 'InProgress', 'Completed', 'Archived'], default: 'InProgress' },
  
  questions: [interviewQuestionSchema],
  
  summary: { type: interviewSummarySchema, default: null },
  coachingReport: { type: mongoose.Schema.Types.Mixed, default: null },

  embedding: { type: [Number], default: null }, // Cosine Similarity Vector
  embeddingHash: { type: String, default: null }, // Hash of content to prevent duplicate generation
}, {
  timestamps: true,
});

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

export default InterviewSession;
