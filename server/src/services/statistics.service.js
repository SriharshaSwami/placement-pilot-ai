import applicationRepository from '../repositories/application.repository.js';
import interviewRepository from '../repositories/interview.repository.js';

class StatisticsService {
  async getDashboardStats(userId) {
    const appStats = await applicationRepository.getAggregatedStats(userId);
    
    // Parse aggregate
    const stages = { Saved: 0, Applied: 0, OA: 0, Interview: 0, Offer: 0, Rejected: 0 };
    appStats.forEach(stat => {
      stages[stat._id] = stat.count;
    });

    const totalApplications = Object.values(stages).reduce((a, b) => a + b, 0);
    const activeApplications = totalApplications - stages.Offer - stages.Rejected - stages.Saved;
    
    const responseRate = totalApplications > 0 ? ((stages.OA + stages.Interview + stages.Offer + stages.Rejected) / totalApplications * 100).toFixed(0) : 0;
    const offerRate = totalApplications > 0 ? ((stages.Offer) / totalApplications * 100).toFixed(0) : 0;

    // Upcoming interviews logic can be derived from interviewRepository if needed
    const interviews = await interviewRepository.findByUserId(userId, { status: 'InProgress' });

    return {
      totalApplications,
      activeApplications,
      stages,
      responseRate: Number(responseRate),
      offerRate: Number(offerRate),
      activeInterviews: interviews.length,
    };
  }
}

export default new StatisticsService();
