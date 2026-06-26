import mongoose from 'mongoose';

const codingReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    repository: {
      type: String,
    },
    prompt: {
      type: String,
      required: true,
    },
    aiFeedback: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
codingReviewSchema.index({ userId: 1 });

const CodingReview = mongoose.model('CodingReview', codingReviewSchema);
export default CodingReview;
