import CareerProfile from '../models/CareerProfile.js';
import CareerRoadmap from '../models/CareerRoadmap.js';

class CareerRepository {
  async getProfile(userId) {
    return CareerProfile.findOne({ userId });
  }

  async upsertProfile(userId, profileData) {
    return CareerProfile.findOneAndUpdate(
      { userId },
      { ...profileData, userId },
      { new: true, upsert: true }
    );
  }

  async getRoadmap(userId) {
    return CareerRoadmap.findOne({ userId, isActive: true });
  }

  async upsertRoadmap(userId, roadmapData) {
    return CareerRoadmap.findOneAndUpdate(
      { userId, isActive: true },
      { ...roadmapData, userId, lastGeneratedAt: new Date() },
      { new: true, upsert: true }
    );
  }

  async updateTaskStatus(userId, taskId, status) {
    return CareerRoadmap.findOneAndUpdate(
      { userId, 'tasks._id': taskId },
      { $set: { 'tasks.$.status': status } },
      { new: true }
    );
  }
}

export default new CareerRepository();
