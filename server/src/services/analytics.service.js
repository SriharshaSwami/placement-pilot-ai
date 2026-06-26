import analyticsRepository from '../repositories/analytics.repository.js';
import resumeRepository from '../repositories/resume.repository.js';
import applicationRepository from '../repositories/application.repository.js';
import codingRepository from '../repositories/coding.repository.js';
import interviewRepository from '../repositories/interview.repository.js';
import careerRepository from '../repositories/career.repository.js';

import geminiAdapter from '../ai/adapters/gemini.adapter.js';
import { validateSchema } from '../ai/validators/schema.validator.js';
import { analyticsInsightsSchema } from '../ai/schemas/analyticsInsights.schema.js';
import { buildAnalyticsPrompt } from '../ai/prompts/analytics/analytics.prompt.js';

class AnalyticsService {
  
  async getDashboardData(userId) {
    // 1. Calculate Live Aggregates
    const metrics = await this.calculateLiveMetrics(userId);
    
    // 2. Generate Readiness Score
    const readinessScore = this.calculateReadinessScore(metrics);
    metrics.readinessScore = readinessScore;

    // 3. Save Daily Snapshot (Fast trend retrieval later)
    await analyticsRepository.saveSnapshot(userId, readinessScore, metrics);

    // 4. Retrieve 30-day Trend History
    const history = await analyticsRepository.getHistoricalSnapshots(userId, 30);

    // 5. Generate AI Insights based on current state
    const promptBuilder = buildAnalyticsPrompt(metrics);
    const { parsedJSON: insights } = await geminiAdapter.generateStructuredJSON(
      promptBuilder.buildContent(),
      analyticsInsightsSchema,
      promptBuilder.getSystemInstruction()
    );

    return {
      currentScore: readinessScore,
      metrics,
      history: history.map(h => ({ date: h.date, score: h.readinessScore })),
      insights
    };
  }

  async calculateLiveMetrics(userId) {
    // Resumes
    const resumes = await resumeRepository.findByUserId(userId);
    const resumeAvg = resumes.length > 0 ? 85 : 0; // Stubbed ATS calc logic for speed

    // Applications & Funnel
    const apps = await applicationRepository.findByUserId(userId);
    const funnel = {
      total: apps.length,
      saved: apps.filter(a => a.status === 'Saved').length,
      applied: apps.filter(a => a.status === 'Applied').length,
      interviews: apps.filter(a => a.status === 'Interview').length,
      offers: apps.filter(a => a.status === 'Offer').length,
    };
    const conversionRate = funnel.total > 0 ? Math.round((funnel.interviews / funnel.total) * 100) : 0;

    // Interviews
    const interviews = await interviewRepository.findByUserId(userId);
    const mockAvg = interviews.length > 0 ? 
      interviews.reduce((acc, curr) => acc + (curr.evaluation?.overallScore || 0), 0) / interviews.length : 0;

    // Coding
    const coding = await codingRepository.findByUserId(userId);
    const codeAvg = coding.length > 0 ? 
      coding.reduce((acc, curr) => acc + (curr.evaluation?.overallScore || 0), 0) / coding.length : 0;

    // Roadmap Task Completion
    const roadmap = await careerRepository.getRoadmap(userId);
    let roadmapProgress = 0;
    if (roadmap && roadmap.tasks.length > 0) {
      const completed = roadmap.tasks.filter(t => t.status === 'Completed').length;
      roadmapProgress = Math.round((completed / roadmap.tasks.length) * 100);
    }

    return {
      resumeAvg,
      applicationConversionRate: conversionRate,
      mockInterviewAvg: Math.round(mockAvg),
      codingInterviewAvg: Math.round(codeAvg),
      roadmapProgress,
      funnel
    };
  }

  calculateReadinessScore(metrics) {
    // Weighted algorithm
    const wResume = metrics.resumeAvg * 0.20;
    const wApps = Math.min(metrics.applicationConversionRate * 2, 100) * 0.25; // Boost conversion rate
    const wMock = metrics.mockInterviewAvg * 0.25;
    const wCode = metrics.codingInterviewAvg * 0.20;
    const wRoadmap = metrics.roadmapProgress * 0.10;

    return Math.round(wResume + wApps + wMock + wCode + wRoadmap);
  }
}

export default new AnalyticsService();
