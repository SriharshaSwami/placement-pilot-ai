import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/responseFormatter.js';
import knowledgeService from '../services/knowledge.service.js';

export const getKnowledgeBase = asyncHandler(async (req, res) => {
  const documents = await knowledgeService.getIndexedDocuments(req.user._id);
  res.status(200).json(successResponse(documents, 'Knowledge base retrieved'));
});

// For demonstration, a manual trigger endpoint. Usually this happens via event queues.
export const manualIndex = asyncHandler(async (req, res) => {
  const { documentId, documentType, rawText } = req.body;
  const meta = await knowledgeService.indexDocument(req.user._id, documentId, documentType, rawText);
  res.status(200).json(successResponse(meta, 'Document indexed successfully'));
});
