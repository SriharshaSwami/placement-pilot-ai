import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import resumesService from '../services/resumes.service.js';
import resumeParserService from '../services/parser/resumeParser.service.js';
import CustomError from '../errors/CustomError.js';

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new CustomError('Please upload a PDF file', 400, 'NO_FILE_PROVIDED');
  }

  const resume = await resumesService.uploadResume(req.user._id, req.file, req.body.title);
  res.status(201).json(successResponse(resume, 'Resume uploaded successfully'));
});

export const getResumes = asyncHandler(async (req, res) => {
  const resumes = await resumesService.listResumes(req.user._id);
  res.status(200).json(successResponse(resumes, 'Resumes fetched successfully'));
});

export const getResume = asyncHandler(async (req, res) => {
  const resume = await resumesService.getResume(req.user._id, req.params.id);
  res.status(200).json(successResponse(resume, 'Resume fetched successfully'));
});

export const renameResume = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    throw new CustomError('Title is required', 400, 'VALIDATION_ERROR');
  }
  const resume = await resumesService.renameResume(req.user._id, req.params.id, title);
  res.status(200).json(successResponse(resume, 'Resume renamed successfully'));
});

export const setPrimaryResume = asyncHandler(async (req, res) => {
  const resume = await resumesService.setPrimaryResume(req.user._id, req.params.id);
  res.status(200).json(successResponse(resume, 'Primary resume updated successfully'));
});

export const deleteResume = asyncHandler(async (req, res) => {
  await resumesService.deleteResume(req.user._id, req.params.id);
  res.status(200).json(successResponse(null, 'Resume deleted successfully'));
});

export const parseResume = asyncHandler(async (req, res) => {
  // Validate ownership first
  await resumesService.getResume(req.user._id, req.params.id);
  
  // Trigger parsing pipeline
  const parsedData = await resumeParserService.createStructuredResume(req.params.id);
  
  res.status(200).json(successResponse(parsedData.metadata, 'Resume parsed successfully'));
});
