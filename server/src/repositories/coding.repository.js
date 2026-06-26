import CodingSession from '../models/CodingSession.js';

class CodingRepository {
  async create(sessionData) {
    const session = new CodingSession(sessionData);
    return session.save();
  }

  async findById(id) {
    return CodingSession.findById(id);
  }

  async findByUserId(userId) {
    return CodingSession.find({ userId }).sort({ createdAt: -1 });
  }

  async updateById(id, updateData) {
    return CodingSession.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }
}

export default new CodingRepository();
