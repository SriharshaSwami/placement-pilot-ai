import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import tailoringService from '../services/tailoring.service.js';

export const initiateTailoring = asyncHandler(async (req, res) => {
  const { jobId, resumeId } = req.body;
  const session = await tailoringService.generateTailoringSession(req.user._id, jobId, resumeId);
  res.status(201).json(successResponse(session, 'Tailoring session generated'));
});

export const getSession = asyncHandler(async (req, res) => {
  const session = await tailoringService.getSession(req.user._id, req.params.sessionId);
  res.status(200).json(successResponse(session, 'Session retrieved'));
});

export const getSessionByParams = asyncHandler(async (req, res) => {
  const { jobId, resumeId } = req.query;
  const session = await tailoringService.getSessionByJobAndResume(req.user._id, jobId, resumeId);
  res.status(200).json(successResponse(session, 'Session retrieved'));
});

export const updateSuggestionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const session = await tailoringService.updateSuggestionStatus(
    req.user._id,
    req.params.sessionId,
    req.params.suggestionId,
    status
  );
  res.status(200).json(successResponse(session, 'Suggestion status updated'));
});

export const batchUpdateSuggestions = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const session = await tailoringService.batchUpdateSuggestions(
    req.user._id,
    req.params.sessionId,
    status
  );
  res.status(200).json(successResponse(session, 'Suggestions updated successfully'));
});

export const saveTailoredResume = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const newResume = await tailoringService.saveTailoredResume(
    req.user._id,
    req.params.sessionId,
    title
  );
  res.status(201).json(successResponse(newResume, 'Tailored resume saved successfully'));
});
