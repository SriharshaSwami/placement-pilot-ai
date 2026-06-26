import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import Resume from '../models/Resume.js';
import Application from '../models/Application.js';
import InterviewSession from '../models/InterviewSession.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import AgentExecution from '../models/AgentExecution.js';

export const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch counts
  const resumesCount = await Resume.countDocuments({ user: userId });
  const applicationsCount = await Application.countDocuments({ user: userId });
  const interviewsCount = await InterviewSession.countDocuments({ user: userId });

  // Get real AI Usage from agent executions
  const aiUsage = await AgentExecution.countDocuments({ userId });

  // Get dynamic resume score by averaging ATS scores
  const analyses = await ResumeAnalysis.find({ userId });
  const resumeScore = analyses.length > 0 
    ? Math.round(analyses.reduce((acc, curr) => acc + curr.atsScore, 0) / analyses.length) 
    : 0;

  // Get recent applications as activity
  const recentApplications = await Application.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('job');

  const recentActivity = recentApplications.map(app => ({
    title: 'Application Added',
    description: `Applied to ${app.companyName || (app.job && app.job.company) || 'a company'} for ${app.role || (app.job && app.job.title) || 'a role'}`,
    date: app.createdAt.toISOString()
  }));

  if (recentActivity.length === 0) {
    recentActivity.push({
      title: 'Welcome to PlacementPilot!',
      description: 'Start by uploading your resume or adding a job application.',
      date: new Date().toISOString()
    });
  }

  const data = {
    resumeScore,
    applications: applicationsCount,
    interviews: interviewsCount,
    aiUsage,
    recentActivity
  };

  res.status(200).json(successResponse(data, 'Dashboard data fetched successfully'));
});
