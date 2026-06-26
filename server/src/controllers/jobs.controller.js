import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import jobsService from '../services/jobs.service.js';

export const createJob = asyncHandler(async (req, res) => {
  const job = await jobsService.createJob(req.user._id, req.body);
  res.status(201).json(successResponse(job, 'Job created successfully'));
});

export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await jobsService.listJobs(req.user._id);
  res.status(200).json(successResponse(jobs, 'Jobs fetched successfully'));
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await jobsService.getJob(req.user._id, req.params.id);
  res.status(200).json(successResponse(job, 'Job fetched successfully'));
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await jobsService.updateJob(req.user._id, req.params.id, req.body);
  res.status(200).json(successResponse(job, 'Job updated successfully'));
});

export const deleteJob = asyncHandler(async (req, res) => {
  await jobsService.deleteJob(req.user._id, req.params.id);
  res.status(200).json(successResponse(null, 'Job deleted successfully'));
});
