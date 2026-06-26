import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import applicationService from '../services/application.service.js';
import statisticsService from '../services/statistics.service.js';

export const createApplication = asyncHandler(async (req, res) => {
  const app = await applicationService.createApplication(req.user._id, req.body);
  res.status(201).json(successResponse(app, 'Application created successfully'));
});

export const getApplications = asyncHandler(async (req, res) => {
  const apps = await applicationService.listApplications(req.user._id, req.query);
  res.status(200).json(successResponse(apps, 'Applications retrieved'));
});

export const getApplication = asyncHandler(async (req, res) => {
  const app = await applicationService.getApplication(req.user._id, req.params.id);
  res.status(200).json(successResponse(app, 'Application retrieved'));
});

export const updateApplication = asyncHandler(async (req, res) => {
  const app = await applicationService.updateApplication(req.user._id, req.params.id, req.body);
  res.status(200).json(successResponse(app, 'Application updated'));
});

export const deleteApplication = asyncHandler(async (req, res) => {
  await applicationService.deleteApplication(req.user._id, req.params.id);
  res.status(200).json(successResponse(null, 'Application deleted'));
});

export const generateInsights = asyncHandler(async (req, res) => {
  const app = await applicationService.generateInsights(req.user._id, req.params.id);
  res.status(200).json(successResponse(app, 'Insights generated'));
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await statisticsService.getDashboardStats(req.user._id);
  res.status(200).json(successResponse(stats, 'Stats retrieved'));
});
