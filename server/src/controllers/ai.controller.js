import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import resumeAnalysisService from '../services/resumeAnalysis.service.js';
import AiUsage from '../models/AiUsage.js';
import auditService from '../services/audit.service.js';

export const analyzeResume = asyncHandler(async (req, res) => {
  const analysis = await resumeAnalysisService.analyzeResume(req.user._id, req.params.id);
  
  // Track AI Usage
  await AiUsage.create({
    userId: req.user._id,
    feature: 'resume_analysis',
    model: 'gemini', // Assuming default gemini model
    status: 'success'
  });

  await auditService.logEvent({
    userId: req.user._id,
    action: 'AI_RESUME_ANALYSIS',
    resource: `Resume:${req.params.id}`,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  res.status(200).json(successResponse(analysis, 'Resume analyzed successfully'));
});

export const getResumeAnalysis = asyncHandler(async (req, res) => {
  const analysis = await resumeAnalysisService.getAnalysis(req.user._id, req.params.id);
  res.status(200).json(successResponse(analysis, 'Resume analysis fetched successfully'));
});
