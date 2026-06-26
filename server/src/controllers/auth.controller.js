import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../errors/CustomError.js';
import { successResponse } from '../utils/responseFormatter.js';
import config from '../config/index.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// Send Token Response
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  user.passwordHash = undefined; // Don't send password hash

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json(successResponse({ user, token }, message));
};

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new CustomError('Please provide name, email and password', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new CustomError('User already exists', 409));
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password,
  });

  sendTokenResponse(user, 201, res, 'User registered successfully');
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    return next(new CustomError('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new CustomError('Invalid credentials', 401));
  }

  user.lastLoginAt = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, 'Login successful');
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json(successResponse({}, 'Logged out successfully'));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(successResponse({ user }, 'User details retrieved successfully'));
});
