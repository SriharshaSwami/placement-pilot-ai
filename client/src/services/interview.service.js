import api from '../lib/axios.js';

export const setupInterview = async (configData) => {
  return api.post('/interviews/setup', configData);
};

export const getInterviews = async () => {
  return api.get('/interviews');
};

export const getInterview = async (id) => {
  return api.get(`/interviews/${id}`);
};

export const generateNextQuestion = async (id) => {
  return api.post(`/interviews/${id}/question`);
};

export const submitAnswer = async (id, questionSequenceNumber, answerText) => {
  return api.post(`/interviews/${id}/answer`, { questionSequenceNumber, answerText });
};

export const finishInterview = async (id) => {
  return api.post(`/interviews/${id}/finish`);
};
