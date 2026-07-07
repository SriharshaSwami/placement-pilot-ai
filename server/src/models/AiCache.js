import mongoose from 'mongoose';

const aiCacheSchema = new mongoose.Schema({
  requestHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  featureName: {
    type: String,
    required: true
  },
  responsePayload: {
    type: mongoose.Schema.Types.Mixed, // Can store objects, strings, arrays, etc.
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 24 * 60 * 60 // Automatically expire caches older than 30 days
  }
}, { timestamps: false });

export default mongoose.model('AiCache', aiCacheSchema);
