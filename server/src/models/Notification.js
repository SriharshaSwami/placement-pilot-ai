import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['Deadline', 'Interview', 'OA', 'System', 'OfferExpiration'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  actionUrl: { type: String },
  isRead: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
