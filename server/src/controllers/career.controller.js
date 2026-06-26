import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import careerService from '../services/career.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await careerService.getProfile(req.user._id);
  res.status(200).json(successResponse(profile || {}, 'Profile retrieved'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await careerService.updateProfile(req.user._id, req.body);
  res.status(200).json(successResponse(profile, 'Profile updated'));
});

export const getRoadmap = asyncHandler(async (req, res) => {
  const force = req.query.force === 'true';
  const roadmap = await careerService.getRoadmap(req.user._id, force);
  res.status(200).json(successResponse(roadmap, 'Roadmap generated/retrieved'));
});

export const updateTask = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const roadmap = await careerService.toggleTaskStatus(req.user._id, req.params.taskId, status);
  res.status(200).json(successResponse(roadmap, 'Task updated'));
});
