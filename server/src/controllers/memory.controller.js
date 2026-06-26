import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import memoryService from '../services/memory.service.js';

export const getMemories = asyncHandler(async (req, res) => {
  const memories = await memoryService.getAllMemories(req.user._id);
  res.status(200).json(successResponse(memories, 'Memories retrieved'));
});

export const deleteMemory = asyncHandler(async (req, res) => {
  await memoryService.deleteMemory(req.user._id, req.params.id);
  res.status(200).json(successResponse(null, 'Memory deleted successfully'));
});

export const resetMemories = asyncHandler(async (req, res) => {
  await memoryService.resetMemory(req.user._id);
  res.status(200).json(successResponse(null, 'Memory wiped successfully'));
});

export const exportMemories = asyncHandler(async (req, res) => {
  const data = await memoryService.exportMemories(req.user._id);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=placementpilot_memory.json');
  res.status(200).send(JSON.stringify(data, null, 2));
});

// Admin/Debug testing endpoint
export const manualExtract = asyncHandler(async (req, res) => {
  const extracted = await memoryService.extractAndStore(req.user._id, req.body.text, req.body.source);
  res.status(200).json(successResponse(extracted, 'Memory extracted'));
});
