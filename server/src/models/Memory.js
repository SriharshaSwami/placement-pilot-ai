import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['Career', 'Skill', 'Resume', 'Interview', 'Coding', 'Learning', 'Goal', 'Preference', 'Behavior', 'General'],
    required: true,
    index: true
  },
  fact: {
    type: String,
    required: true
  },
  importance: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
    default: 5
  },
  confidence: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
    default: 5
  },
  source: {
    type: String, // e.g. "Mock Interview #12", "Resume Parsing", "User Settings"
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
});

const Memory = mongoose.model('Memory', memorySchema);

export default Memory;
