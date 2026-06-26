import mongoose from 'mongoose';

const careerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  preferredRole: { type: String, required: true },
  targetCompanies: [String],
  currentSkills: [String],
  programmingLanguages: [String],
  frameworks: [String],
  experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  preferredDomain: { type: String },
  learningPace: { type: String, enum: ['Slow', 'Medium', 'Fast'], default: 'Medium' },
  careerGoal: { type: String },
}, {
  timestamps: true,
});

const CareerProfile = mongoose.model('CareerProfile', careerProfileSchema);

export default CareerProfile;
