import mongoose from 'mongoose';

const aiConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    feature: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    tokenUsage: {
      type: Number,
      default: 0,
    },
    latencyMs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
aiConversationSchema.index({ userId: 1 });

const AIConversation = mongoose.model('AIConversation', aiConversationSchema);
export default AIConversation;
