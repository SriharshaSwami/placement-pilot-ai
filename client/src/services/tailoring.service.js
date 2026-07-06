import api from '../lib/axios.js';

export const initiateTailoring = async (jobId, resumeId) => {
  return api.post('/tailoring', { jobId, resumeId });
};

export const getSession = async (sessionId) => {
  return api.get(`/tailoring/${sessionId}`);
};

export const lookupSession = async (jobId, resumeId) => {
  return api.get(`/tailoring/lookup?jobId=${jobId}&resumeId=${resumeId}`);
};

export const updateSuggestionStatus = async (sessionId, suggestionId, status) => {
  return api.patch(`/tailoring/${sessionId}/suggestions/${suggestionId}`, { status });
};

export const batchUpdateSuggestions = async (sessionId, status) => {
  return api.patch(`/tailoring/${sessionId}/suggestions`, { status });
};

export const saveTailoredResume = async (sessionId, title) => {
  return api.post(`/tailoring/${sessionId}/save`, { title });
};

export const generateTargetedSuggestion = async (sessionId, targetSkill) => {
  return api.post(`/tailoring/${sessionId}/targeted`, { targetSkill });
};
