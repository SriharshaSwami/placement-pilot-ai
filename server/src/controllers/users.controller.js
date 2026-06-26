import { successResponse } from '../utils/responseFormatter.js';
import asyncHandler from '../utils/asyncHandler.js';

export const scaffoldUsers = asyncHandler(async (req, res) => {
  return res.status(200).json(successResponse(null, 'users endpoint scaffolded'));
});
