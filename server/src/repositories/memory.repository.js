import Memory from '../models/Memory.js';
import MemorySummary from '../models/MemorySummary.js';

class MemoryRepository {
  async saveMany(memories) {
    return Memory.insertMany(memories);
  }

  async findActiveByUserId(userId) {
    return Memory.find({ userId, isActive: true }).sort({ importance: -1, createdAt: -1 });
  }

  async hardDeleteMemory(userId, memoryId) {
    return Memory.findOneAndDelete({ _id: memoryId, userId });
  }

  async hardResetMemories(userId) {
    await MemorySummary.deleteMany({ userId });
    return Memory.deleteMany({ userId });
  }

  async softDeleteOldMemories(memoryIds) {
    return Memory.updateMany({ _id: { $in: memoryIds } }, { isActive: false });
  }

  async saveSummary(userId, summaryText, memoryIdsIncluded) {
    return MemorySummary.create({ userId, summaryText, memoryIdsIncluded });
  }
}

export default new MemoryRepository();
