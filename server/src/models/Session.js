import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: 'Unknown',
    },
    ipAddress: {
      type: String,
      default: 'Unknown',
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index to automatically remove expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
