import asyncHandler from '../utils/asyncHandler.js';
import sessionService from '../services/session.service.js';
import { successResponse } from '../utils/responseFormatter.js';
import CustomError from '../errors/CustomError.js';

export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await sessionService.getUserSessions(req.user._id);
  res.status(200).json(successResponse({ sessions }, 'Sessions retrieved successfully'));
});

export const revokeSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  
  if (!sessionId) {
    throw new CustomError('Session ID is required', 400);
  }

  await sessionService.revokeSession(req.user._id, sessionId);
  res.status(200).json(successResponse(null, 'Session revoked successfully'));
});

export const revokeAllOtherSessions = asyncHandler(async (req, res) => {
  // Find current session using refresh token
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) {
    throw new CustomError('Not logged in properly to revoke other sessions', 400);
  }

  // A bit hacky to require mongoose here, better to put in service, but we just need current session
  import('../models/Session.js').then(async ({ default: Session }) => {
    const currentSession = await Session.findOne({ refreshToken: oldRefreshToken });
    
    if (currentSession) {
      await sessionService.revokeOtherSessions(req.user._id, currentSession._id);
    }
  });

  res.status(200).json(successResponse(null, 'Other sessions revoked successfully'));
});
