import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  section: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  confidence: { type: Number, required: true },
  reason: { type: String, required: true },
  targetPath: { type: String, required: true },
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
  
  // Pipeline Stages
  generationStatus: { 
    type: String, 
    enum: ['analyzing_jd', 'extracting_profile', 'gap_analysis', 'generating_resume', 'measuring_fit', 'emergency_compression', 'validating', 'comparing_diff', 'preparing_suggestions', 'completed', 'failed'],
    default: 'analyzing_jd'
  },
  
  jdAnalysis: { type: mongoose.Schema.Types.Mixed },
  gapAnalysis: { type: mongoose.Schema.Types.Mixed },
  resumeStrategy: { type: mongoose.Schema.Types.Mixed },
  tailoredStructuredResume: { type: mongoose.Schema.Types.Mixed },
  validationScores: { type: mongoose.Schema.Types.Mixed },
  fitReport: { type: mongoose.Schema.Types.Mixed },
  qualityReport: { type: mongoose.Schema.Types.Mixed },
  aiCallCount: { type: Number, default: 0 },

  matchAnalysis: { // Keeping for backwards compatibility or gapAnalysis mappings
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
