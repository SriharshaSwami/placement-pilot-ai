import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import analyticsService from '../services/analytics.service.js';

export const getAnalyticsDashboard = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDashboardData(req.user._id);
  res.status(200).json(successResponse(data, 'Analytics retrieved successfully'));
});
