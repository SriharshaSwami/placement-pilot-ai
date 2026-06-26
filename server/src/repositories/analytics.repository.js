import PlacementAnalyticsSnapshot from '../models/PlacementAnalyticsSnapshot.js';

class AnalyticsRepository {
  async getLatestSnapshot(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return PlacementAnalyticsSnapshot.findOne({ userId, date: today });
  }

  async saveSnapshot(userId, readinessScore, metrics) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return PlacementAnalyticsSnapshot.findOneAndUpdate(
      { userId, date: today },
      { userId, date: today, readinessScore, metrics },
      { new: true, upsert: true }
    );
  }

  async getHistoricalSnapshots(userId, days = 30) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days);

    return PlacementAnalyticsSnapshot.find({ 
      userId, 
      date: { $gte: pastDate } 
    }).sort({ date: 1 });
  }
}

export default new AnalyticsRepository();
