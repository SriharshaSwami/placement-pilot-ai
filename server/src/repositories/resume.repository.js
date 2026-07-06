import Resume from '../models/Resume.js';

class ResumeRepository {
  async create(resumeData) {
    const resume = new Resume(resumeData);
    return resume.save();
  }

  async findByUserId(userId) {
    return Resume.find({ userId, deletedAt: null }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return Resume.findOne({ _id: id, deletedAt: null });
  }

  async findByIdAndUserId(id, userId) {
    return Resume.findOne({ _id: id, userId, deletedAt: null });
  }

  async countByUserId(userId) {
    return Resume.countDocuments({ userId, deletedAt: null });
  }

  async findVersions(parentId, userId) {
    return Resume.find({
      userId,
      deletedAt: null,
      $or: [{ _id: parentId }, { parentResumeId: parentId }]
    })
      .sort({ createdAt: -1 })
      .populate('jobId', 'company title');
  }

  async count(query) {
    return Resume.countDocuments({ ...query, deletedAt: null });
  }

  async countPrimaryByUserId(userId) {
    return Resume.countDocuments({ userId, isPrimary: true, deletedAt: null });
  }

  async updateById(id, updateData) {
    return Resume.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async updateParsedData(id, parsedData) {
    return Resume.findByIdAndUpdate(
      id,
      { $set: { parsedData } },
      { new: true, runValidators: true }
    );
  }

  async unsetPrimaryResumes(userId) {
    return Resume.updateMany(
      { userId, isPrimary: true, deletedAt: null },
      { $set: { isPrimary: false } }
    );
  }

  async softDelete(id) {
    return Resume.findByIdAndDelete(id);
  }
}

export default new ResumeRepository();
