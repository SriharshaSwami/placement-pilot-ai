import mongoose from 'mongoose';

const aiUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    feature: {
      type: String,
      required: true, // e.g. 'resume_parsing', 'tailoring', 'interview'
    },
    model: {
      type: String, // e.g. 'gemini-1.5-pro'
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
    errorMessage: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for querying usage per day
aiUsageSchema.index({ userId: 1, feature: 1, createdAt: 1 });

const AiUsage = mongoose.model('AiUsage', aiUsageSchema);
export default AiUsage;
