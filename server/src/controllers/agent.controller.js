import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import orchestrator from '../ai/orchestrator/orchestrator.js';
import AgentExecution from '../models/AgentExecution.js';

export const chatWithAgents = asyncHandler(async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Query is required.' });
  }

  const response = await orchestrator.handleQuery(req.user._id, query);
  
  res.status(200).json(successResponse(response, 'Agent execution complete'));
});

export const getExecutionHistory = asyncHandler(async (req, res) => {
  const history = await AgentExecution.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('-result'); // Don't send huge text blobs for the history list
    
  res.status(200).json(successResponse(history, 'Execution history retrieved'));
});
