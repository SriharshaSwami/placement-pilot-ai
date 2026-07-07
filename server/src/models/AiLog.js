import mongoose from 'mongoose';

const aiLogSchema = new mongoose.Schema({
  featureName: {
    type: String,
    required: true,
    index: true
  },
  model: {
    type: String,
    required: true
  },
  promptTokens: {
    type: Number,
    default: 0
  },
  responseTokens: {
    type: Number,
    default: 0
  },
  totalTokens: {
    type: Number,
    default: 0
  },
  latencyMs: {
    type: Number,
    required: true
  },
  estimatedCostUSD: {
    type: Number,
    default: 0
  },
  cacheHit: {
    type: Boolean,
    default: false
  },
  isRetry: {
    type: Boolean,
    default: false
  },
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Some requests might be anonymous or system-level
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 30 * 24 * 60 * 60 // Automatically delete logs older than 30 days
  }
}, { timestamps: false });

export default mongoose.model('AiLog', aiLogSchema);
