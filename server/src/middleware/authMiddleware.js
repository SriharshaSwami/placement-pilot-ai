import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../errors/CustomError.js';
import User from '../models/User.js';
import config from '../config/index.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in cookies or Authorization header
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new CustomError('Not authorized to access this route', 401, 'UNAUTHORIZED'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new CustomError('The user belonging to this token no longer exists.', 401, 'UNAUTHORIZED'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new CustomError('Not authorized to access this route', 401, 'UNAUTHORIZED'));
  }
});
