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
}

export default new InterviewRepository();
