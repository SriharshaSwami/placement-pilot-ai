import mongoose from 'mongoose';

const memorySummarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  summaryText: {
    type: String,
    required: true
  },
  memoryIdsIncluded: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Memory'
  }]
}, {
  timestamps: true,
});

const MemorySummary = mongoose.model('MemorySummary', memorySummarySchema);

export default MemorySummary;
