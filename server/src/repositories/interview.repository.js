import InterviewSession from '../models/InterviewSession.js';

class InterviewRepository {
  async createSession(sessionData) {
    const session = new InterviewSession(sessionData);
    return session.save();
  }

  async findById(id) {
    return InterviewSession.findById(id).populate('resumeId').populate('jobId');
  }

  async findByUserId(userId, options = {}) {
    const query = { userId, ...options };
    return InterviewSession.find(query)
      .populate('resumeId', 'title')
      .populate('jobId', 'role company')
      .sort({ updatedAt: -1 });
  }

  async updateSession(id, updateData) {
    return InterviewSession.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('resumeId')
      .populate('jobId');
  }

  async archiveStaleSessions(userId) {
    // 2 hours threshold
    const staleThreshold = new Date(Date.now() - 2 * 60 * 60 * 1000);
    return InterviewSession.updateMany(
      { userId, status: 'InProgress', updatedAt: { $lt: staleThreshold } },
      { $set: { status: 'Archived' } }
    );
  }

  async archiveAllActiveSessions(userId) {
    return InterviewSession.updateMany(
      { userId, status: 'InProgress' },
      { $set: { status: 'Archived' } }
    );
  }
}

export default new InterviewRepository();
