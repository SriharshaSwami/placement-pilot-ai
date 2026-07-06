import api from '../lib/axios.js';

export const chatWithAgents = async (query) => {
  return api.post('/agents/chat', { query });
};

export const getExecutionHistory = async () => {
  return api.get('/agents/history');
};

export const clearExecutionHistory = async () => {
  return api.delete('/agents/history');
};
