import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String, default: '' },
  jobType: { type: String, default: '' },
  source: { type: String, default: '' },
  
  description: { type: String, required: true }, // The raw pasted job description
  extractedText: { type: String }, // Cleaned text
  
  parsedSections: {
    type: Map,
    of: String,
  },
  
  requiredSkills: [String],
  preferredSkills: [String],
  keywords: [String],
  
  isArchived: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
