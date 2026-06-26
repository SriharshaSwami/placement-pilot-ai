import Application from '../models/Application.js';

class ApplicationRepository {
  async create(applicationData) {
    const app = new Application(applicationData);
    // Push initial status
    app.statusHistory.push({ stage: app.stage, date: new Date() });
    return app.save();
  }

  async findById(id) {
    return Application.findById(id).populate('jobId').populate('resumeId');
  }

  async findByUserId(userId, filters = {}) {
    return Application.find({ userId, ...filters })
      .populate('jobId', 'role company')
      .sort({ updatedAt: -1 });
  }

  async updateById(id, updateData) {
    const app = await Application.findById(id);
    if (!app) return null;

    // Detect stage change to trigger pre-save hook properly if using .save()
    Object.assign(app, updateData);
    return app.save();
  }

  async deleteById(id) {
    return Application.findByIdAndDelete(id);
  }

  async getAggregatedStats(userId) {
    // Basic aggregation for dashboard
    return Application.aggregate([
      { $match: { userId } },
      { $group: { _id: "$stage", count: { $sum: 1 } } }
    ]);
  }
}

export default new ApplicationRepository();
