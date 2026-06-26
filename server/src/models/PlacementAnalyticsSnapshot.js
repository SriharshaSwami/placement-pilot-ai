import mongoose from 'mongoose';

const placementAnalyticsSnapshotSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: { type: Date, required: true }, // Normalized to start of day
  readinessScore: { type: Number, required: true, min: 0, max: 100 },
  
  metrics: {
    resumeAvg: { type: Number, default: 0 },
    applicationConversionRate: { type: Number, default: 0 },
    mockInterviewAvg: { type: Number, default: 0 },
    codingInterviewAvg: { type: Number, default: 0 },
    roadmapProgress: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
});

// Compound index to ensure one snapshot per user per day
placementAnalyticsSnapshotSchema.index({ userId: 1, date: 1 }, { unique: true });

const PlacementAnalyticsSnapshot = mongoose.model('PlacementAnalyticsSnapshot', placementAnalyticsSnapshotSchema);

export default PlacementAnalyticsSnapshot;
