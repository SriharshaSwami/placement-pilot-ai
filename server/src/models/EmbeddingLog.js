import mongoose from 'mongoose';

const embeddingLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sourceType: {
    type: String,
    enum: ['Resume', 'Job', 'Interview', 'Search', 'Analytics'],
    required: true,
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // Optional for things like 'Search' queries
  },
  model: {
    type: String,
    default: 'text-embedding-004',
  },
  contentHash: {
    type: String,
    required: true,
  },
  durationMs: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

const EmbeddingLog = mongoose.model('EmbeddingLog', embeddingLogSchema);

export default EmbeddingLog;
