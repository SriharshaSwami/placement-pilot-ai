import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import interviewService from '../services/interview.service.js';

export const setupInterview = asyncHandler(async (req, res) => {
  const session = await interviewService.createSession(req.user._id, req.body);
  res.status(201).json(successResponse(session, 'Interview session created'));
});

export const getInterviews = asyncHandler(async (req, res) => {
  const sessions = await interviewService.listSessions(req.user._id);
  res.status(200).json(successResponse(sessions, 'Interview sessions retrieved'));
});

export const getInterview = asyncHandler(async (req, res) => {
  const session = await interviewService.getSession(req.user._id, req.params.id);
  res.status(200).json(successResponse(session, 'Interview session retrieved'));
});

export const generateNextQuestion = asyncHandler(async (req, res) => {
  const session = await interviewService.generateNextQuestion(req.user._id, req.params.id);
  res.status(200).json(successResponse(session, 'Next question generated'));
});

export const submitAnswer = asyncHandler(async (req, res) => {
  const { questionSequenceNumber, answerText } = req.body;
  const session = await interviewService.submitAnswer(req.user._id, req.params.id, questionSequenceNumber, answerText);
  res.status(200).json(successResponse(session, 'Answer evaluated'));
});

export const finishInterview = asyncHandler(async (req, res) => {
  const session = await interviewService.finishInterview(req.user._id, req.params.id);
  res.status(200).json(successResponse(session, 'Interview completed and summarized'));
});
