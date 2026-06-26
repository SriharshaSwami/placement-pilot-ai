import mongoose from 'mongoose';

const interviewMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewSession',
      required: true,
    },
    sender: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    structuredMetadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
interviewMessageSchema.index({ sessionId: 1 });

const InterviewMessage = mongoose.model('InterviewMessage', interviewMessageSchema);
export default InterviewMessage;
