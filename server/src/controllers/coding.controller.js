import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import codingService from '../services/coding.service.js';

export const setupSession = asyncHandler(async (req, res) => {
  const session = await codingService.setupSession(req.user._id, req.body);
  res.status(201).json(successResponse(session, 'Coding session generated'));
});

export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await codingService.listSessions(req.user._id);
  res.status(200).json(successResponse(sessions, 'Coding sessions retrieved'));
});

export const getSession = asyncHandler(async (req, res) => {
  const session = await codingService.getSession(req.user._id, req.params.id);
  res.status(200).json(successResponse(session, 'Coding session retrieved'));
});

export const requestHint = asyncHandler(async (req, res) => {
  const session = await codingService.requestHint(req.user._id, req.params.id);
  res.status(200).json(successResponse(session, 'Hint revealed'));
});

export const submitCode = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const session = await codingService.submitCode(req.user._id, req.params.id, code);
  res.status(200).json(successResponse(session, 'Code submitted and evaluated'));
});
