import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    notificationSettings: {
      type: Map,
      of: Boolean,
      default: {
        email: true,
        push: true,
      },
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userPreferenceSchema.index({ userId: 1 });

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);
export default UserPreference;
