import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../errors/CustomError.js';
import { successResponse } from '../utils/responseFormatter.js';
import config from '../config/index.js';
import sessionService from '../services/session.service.js';
import auditService from '../services/audit.service.js';

// Generate Access Token
const generateAccessToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const sendTokenResponse = async (user, statusCode, req, res, message) => {
  const accessToken = generateAccessToken(user._id);

  // Parse user agent and IP
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const ipAddress = req.ip || req.connection.remoteAddress;

  // Create session
  const { session, refreshToken } = await sessionService.createSession(user._id, userAgent, ipAddress);

  // Cookie options
  const accessTokenOptions = {
    // Use the same expiration as the refresh token (7 days)
    expires: session.expiresAt, 
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
  };

  const refreshTokenOptions = {
    // 7 days
    expires: session.expiresAt,
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    path: '/api/v1/auth/refresh', // Restrict refresh token to refresh endpoint
  };

  user.passwordHash = undefined;

  res
    .status(statusCode)
    .cookie('accessToken', accessToken, accessTokenOptions)
    .cookie('refreshToken', refreshToken, refreshTokenOptions)
    .json(successResponse({ user, accessToken }, message));
};

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new CustomError('User already exists', 409));
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password,
  });

  await auditService.logEvent({
    userId: user._id,
    action: 'REGISTER',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  await sendTokenResponse(user, 201, req, res, 'User registered successfully');
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    return next(new CustomError('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    await auditService.logEvent({
      userId: user._id,
      action: 'LOGIN_FAILED',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    return next(new CustomError('Invalid credentials', 401));
  }

  user.lastLoginAt = Date.now();
  await user.save({ validateBeforeSave: false });

  await auditService.logEvent({
    userId: user._id,
    action: 'LOGIN',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });

  await sendTokenResponse(user, 200, req, res, 'Login successful');
});

export const logout = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  
  if (oldRefreshToken && req.user) {
    // Try to find and invalidate this specific session
    import('../models/Session.js').then(({ default: Session }) => {
      Session.findOneAndDelete({ userId: req.user._id, refreshToken: oldRefreshToken }).catch(() => {});
    });
  }

  if (req.user) {
    await auditService.logEvent({
      userId: req.user._id,
      action: 'LOGOUT',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
  }

  res.cookie('accessToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    path: '/api/v1/auth/refresh',
  });

  res.status(200).json(successResponse({}, 'Logged out successfully'));
});

export const refresh = asyncHandler(async (req, res, next) => {
  const oldRefreshToken = req.cookies.refreshToken;
  
  if (!oldRefreshToken) {
    return next(new CustomError('No refresh token provided', 401, 'NO_REFRESH_TOKEN'));
  }

  // We need to parse userId from old session, or client must pass it? 
  // Wait, session model has refreshToken which is unique. 
  // Let's modify sessionService.rotateSession to just take oldRefreshToken.
  import('../models/Session.js').then(async ({ default: Session }) => {
    const sessionDoc = await Session.findOne({ refreshToken: oldRefreshToken });
    
    if (!sessionDoc) {
      // Replay attack handling if token was reused...
      // Without knowing the user from the token, we can't delete their other sessions easily.
      // But we will just reject it for now.
      return next(new CustomError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN'));
    }

    try {
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const ipAddress = req.ip || req.connection.remoteAddress;

      const { session, newRefreshToken } = await sessionService.rotateSession(sessionDoc.userId, oldRefreshToken, userAgent, ipAddress);

      const user = await User.findById(sessionDoc.userId);
      const accessToken = generateAccessToken(user._id);

      const accessTokenOptions = {
        expires: session.expiresAt, 
        httpOnly: true,
        secure: config.cookie.secure,
        sameSite: config.cookie.sameSite,
      };

      const refreshTokenOptions = {
        expires: session.expiresAt,
        httpOnly: true,
        secure: config.cookie.secure,
        sameSite: config.cookie.sameSite,
        path: '/api/v1/auth/refresh',
      };

      res
        .status(200)
        .cookie('accessToken', accessToken, accessTokenOptions)
        .cookie('refreshToken', newRefreshToken, refreshTokenOptions)
        .json(successResponse({ accessToken }, 'Token refreshed successfully'));
        
    } catch (err) {
      // Clear cookies on error
      res.cookie('accessToken', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
      res.cookie('refreshToken', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true, path: '/api/v1/auth/refresh' });
      return next(err);
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(successResponse({ user }, 'User details retrieved successfully'));
});
