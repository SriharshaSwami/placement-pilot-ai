import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  section: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  confidence: { type: Number, required: true },
  reason: { type: String, required: true },
  originalContent: { type: String, default: '' },
  suggestedContent: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { _id: false });

const tailoringSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  promptVersion: { type: String, required: true },
  modelVersion: { type: String, required: true },
  
  matchAnalysis: {
    overallMatchPercent: Number,
    matchedSkills: [String],
    missingSkills: [String],
    matchedKeywords: [String],
    missingKeywords: [String],
    educationMatch: String,
    experienceMatch: String,
    projectRelevance: String,
    resumeWeaknesses: [String],
    priorityImprovements: [String],
    hiringRiskFactors: [String],
  },
  
  suggestions: [suggestionSchema],
  
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
}, {
  timestamps: true,
});

// Ensure only one active session per job+resume pairing
tailoringSessionSchema.index({ userId: 1, jobId: 1, resumeId: 1 });

const TailoringSession = mongoose.model('TailoringSession', tailoringSessionSchema);

export default TailoringSession;
