import mongoose from 'mongoose';

const roadmapTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['Coding', 'Project', 'Interview', 'Application', 'Study'], required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  status: { type: String, enum: ['Pending', 'InProgress', 'Completed'], default: 'Pending' },
  estimatedHours: { type: Number },
  deadline: { type: Date }
}, { _id: true });

const skillGapSchema = new mongoose.Schema({
  missingSkills: [String],
  weakSkills: [String],
  strongSkills: [String],
  confidence: { type: String, enum: ['Low', 'Medium', 'High'] },
  radarMetrics: {
    dataStructures: { type: Number, min: 0, max: 100, default: 0 },
    systemDesign: { type: Number, min: 0, max: 100, default: 0 },
    communication: { type: Number, min: 0, max: 100, default: 0 },
    frameworks: { type: Number, min: 0, max: 100, default: 0 },
    problemSolving: { type: Number, min: 0, max: 100, default: 0 }
  }
}, { _id: false });

const careerRoadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  skillGap: { type: skillGapSchema, required: true },
  
  weeklyGoals: [String],
  monthlyGoals: [String],
  
  tasks: [roadmapTaskSchema],
  
  resumeImprovements: [String],
  portfolioSuggestions: [String],
  
  lastGeneratedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
});

const CareerRoadmap = mongoose.model('CareerRoadmap', careerRoadmapSchema);

export default CareerRoadmap;
