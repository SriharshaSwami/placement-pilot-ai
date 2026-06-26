import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  stage: { type: String, required: true },
  notes: { type: String, default: '' },
  date: { type: Date, default: Date.now }
}, { _id: false });

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false }
}, { _id: true });

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    // Optional because user might manually add an application without a saved Job description
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  tailoringSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TailoringSession',
  },
  interviewSessionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSession',
  }],
  
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String },
  salary: { type: String },
  jobUrl: { type: String },
  
  stage: {
    type: String,
    enum: ['Saved', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected'],
    default: 'Saved'
  },
  
  applicationDate: { type: Date },
  deadline: { type: Date },
  
  notes: { type: String },
  recruiterName: { type: String },
  recruiterEmail: { type: String },
  
  tags: [String],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  
  reminders: [reminderSchema],
  statusHistory: [statusHistorySchema],
  
  // Stored insights from AI
  aiInsights: {
    healthScore: { type: Number, min: 0, max: 100 },
    missingActions: [String],
    interviewReadiness: { type: String },
    preparationSuggestions: [String],
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
    lastGeneratedAt: { type: Date }
  }
}, {
  timestamps: true,
});

// Auto-push to status history when stage changes
applicationSchema.pre('save', function (next) {
  if (this.isModified('stage')) {
    this.statusHistory.push({
      stage: this.stage,
      date: new Date()
    });
  }
  next();
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
