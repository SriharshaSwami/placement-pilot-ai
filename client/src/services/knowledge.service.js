import api from '../lib/axios.js';

export const getKnowledgeBase = async () => {
  return api.get('/knowledge');
};

export const indexDocument = async (documentId, documentType, rawText) => {
  return api.post('/knowledge/index', { documentId, documentType, rawText });
};
