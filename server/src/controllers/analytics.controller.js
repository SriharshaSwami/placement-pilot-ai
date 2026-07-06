import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import analyticsService from '../services/analytics.service.js';

export const getAnalyticsDashboard = asyncHandler(async (req, res) => {
  const { timeframe } = req.query; // '7d', '30d', or 'all'
  const data = await analyticsService.getDashboardData(req.user._id, timeframe || '30d');
  res.status(200).json(successResponse(data, 'Analytics retrieved successfully'));
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await analyticsService.getPersonalizedRecommendations(req.user._id);
  res.status(200).json(successResponse(recommendations, 'Recommendations retrieved successfully'));
});
