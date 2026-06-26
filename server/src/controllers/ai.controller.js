import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import resumeAnalysisService from '../services/resumeAnalysis.service.js';

export const analyzeResume = asyncHandler(async (req, res) => {
  const analysis = await resumeAnalysisService.analyzeResume(req.user._id, req.params.id);
  res.status(200).json(successResponse(analysis, 'Resume analyzed successfully'));
});

export const getResumeAnalysis = asyncHandler(async (req, res) => {
  const analysis = await resumeAnalysisService.getAnalysis(req.user._id, req.params.id);
  res.status(200).json(successResponse(analysis, 'Resume analysis fetched successfully'));
});
