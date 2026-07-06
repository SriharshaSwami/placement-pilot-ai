import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import searchService from '../services/search.service.js';

export const performSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const results = await searchService.semanticSearch(req.user._id, q);
  res.status(200).json(successResponse(results, 'Search completed successfully'));
});
