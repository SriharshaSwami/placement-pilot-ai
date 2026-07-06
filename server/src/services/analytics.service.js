import mongoose from 'mongoose';
import Application from '../models/Application.js';
import InterviewSession from '../models/InterviewSession.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import Resume from '../models/Resume.js';
import Job from '../models/Job.js';
import NodeCache from 'node-cache';
import geminiAdapter from '../ai/adapters/gemini.adapter.js';

// Cache for 5 minutes
const analyticsCache = new NodeCache({ stdTTL: 300 });

class AnalyticsService {
  async getDashboardData(userId, timeframe = '30d') {
    const cacheKey = `analytics_${userId}_${timeframe}`;
    const cachedData = analyticsCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const dateFilter = this.getDateFilter(timeframe);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const matchStage = { userId: userObjectId };
    if (dateFilter) {
      matchStage.createdAt = { $gte: dateFilter };
    }

    // 1. Interview Score Trend
    const interviewTrend = await InterviewSession.aggregate([
      { $match: matchStage },
      { $match: { 'summary.overallScore': { $exists: true } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          avgScore: { $avg: '$summary.overallScore' }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', score: { $round: ['$avgScore', 1] }, _id: 0 } }
    ]);

    // 2. ATS Score Trend
    const atsTrend = await ResumeAnalysis.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          avgAtsScore: { $avg: '$atsScore' }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', score: { $round: ['$avgAtsScore', 1] }, _id: 0 } }
    ]);

    // 3. Resume Versions Over Time
    const resumeVersions = await Resume.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } }
    ]);

    // 4. Interview Count by Company (from Applications)
    const interviewsByCompany = await Application.aggregate([
      { $match: { ...matchStage, stage: { $in: ['Interview', 'Offer'] } } },
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { company: '$_id', count: 1, _id: 0 } }
    ]);

    // 5. Skills Needing Improvement
    // We combine weaknesses from ResumeAnalysis and InterviewSession
    const resumeWeaknesses = await ResumeAnalysis.aggregate([
      { $match: matchStage },
      { $unwind: '$weaknesses' },
      { $group: { _id: '$weaknesses', count: { $sum: 1 } } }
    ]);

    const interviewWeaknesses = await InterviewSession.aggregate([
      { $match: matchStage },
      { $unwind: '$summary.weakestAreas' },
      { $group: { _id: '$summary.weakestAreas', count: { $sum: 1 } } }
    ]);

    const skillsMap = {};
    resumeWeaknesses.forEach(w => { skillsMap[w._id] = (skillsMap[w._id] || 0) + w.count; });
    interviewWeaknesses.forEach(w => { skillsMap[w._id] = (skillsMap[w._id] || 0) + w.count; });
    
    const skillsNeedingImprovement = Object.keys(skillsMap)
      .map(skill => ({ skill, count: skillsMap[skill] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 6. Job Applications by Status
    const applicationsByStatus = await Application.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 }
        }
      },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);

    const result = {
      interviewTrend,
      atsTrend,
      resumeVersions,
      interviewsByCompany,
      skillsNeedingImprovement,
      applicationsByStatus,
      timeframe,
    };

    analyticsCache.set(cacheKey, result);
    return result;
  }

  getDateFilter(timeframe) {
    const now = new Date();
    if (timeframe === '7d') {
      return new Date(now.setDate(now.getDate() - 7));
    }
    if (timeframe === '30d') {
      return new Date(now.setDate(now.getDate() - 30));
    }
    return null; // All Time
  }

  async getPersonalizedRecommendations(userId) {
    const cacheKey = `recommendations_${userId}`;
    const cached = analyticsCache.get(cacheKey);
    if (cached) return cached;

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const matchStage = { userId: userObjectId };

    // Fetch top weaknesses across interviews and resumes
    const dashboardData = await this.getDashboardData(userId, 'all');
    const { skillsNeedingImprovement, interviewsByCompany } = dashboardData;

    // Get recent jobs to extract role trends
    const recentJobs = await Job.find({ userId: userObjectId }).sort({ createdAt: -1 }).limit(10).lean();
    const targetRoles = recentJobs.map(j => j.role).join(', ');

    if (!targetRoles && skillsNeedingImprovement.length === 0) {
      return ["Complete an interview or add jobs to get personalized recommendations."];
    }

    const prompt = `
      You are an expert career coach. Based on the user's data, generate 3 highly personalized, actionable sentences of advice.
      Target Roles: ${targetRoles || 'Unknown'}
      Top Weaknesses/Missing Skills: ${skillsNeedingImprovement.map(s => s.skill).join(', ')}
      Interviews at: ${interviewsByCompany.map(c => c.company).join(', ')}

      Respond ONLY with a JSON array of 3 string recommendations. E.g. ["Advice 1", "Advice 2", "Advice 3"].
    `;

    try {
      const response = await geminiAdapter.generateContent(prompt, {
        temperature: 0.3,
        systemInstruction: "You are a direct, concise career coach."
      });
      // Try to parse array
      const matches = response.match(/\[.*\]/s);
      if (matches) {
        const recommendations = JSON.parse(matches[0]);
        analyticsCache.set(cacheKey, recommendations, 3600); // 1 hour cache
        return recommendations;
      }
    } catch (err) {
      console.error("[AnalyticsService] Failed to generate recommendations", err);
    }

    return ["Analyze your recent interviews to identify recurring weaknesses.", "Tailor your resume specifically for the roles you are applying to."];
  }
}

export default new AnalyticsService();
