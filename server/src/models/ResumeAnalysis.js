import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  title: String,
  feedback: String,
  score: Number,
}, { _id: false });

const resumeAnalysisSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  
  // AI Metadata
  analysisVersion: { type: String, required: true },
  modelUsed: { type: String, required: true },
  promptVersion: { type: String, required: true },
  
  // High-Level Metrics
  atsScore: { type: Number, required: true, min: 0, max: 100 },
  summary: { type: String, required: true },
  
  // List-based Insights
  strengths: [String],
  weaknesses: [String],
  missingKeywords: [String],
  recommendations: [String],
  
  // Detailed Section Feedback
  projectFeedback: [feedbackSchema],
  educationFeedback: [feedbackSchema],
  experienceFeedback: [feedbackSchema],
  
  // Debug / Audit
  rawResponse: { type: String, select: false },
}, {
  timestamps: true,
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

export default ResumeAnalysis;
