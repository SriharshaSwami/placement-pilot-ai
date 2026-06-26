import api from '../lib/axios.js';

export const analyzeResume = async (resumeId) => {
  return api.post(`/ai/resume/${resumeId}/analyze`);
};

export const getResumeAnalysis = async (resumeId) => {
  return api.get(`/ai/resume/${resumeId}/analysis`);
};
