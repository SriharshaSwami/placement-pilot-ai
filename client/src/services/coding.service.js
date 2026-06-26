import api from '../lib/axios.js';

export const setupCodingSession = async (configData) => {
  return api.post('/coding/setup', configData);
};

export const getCodingSessions = async () => {
  return api.get('/coding');
};

export const getCodingSession = async (id) => {
  return api.get(`/coding/${id}`);
};

export const requestHint = async (id) => {
  return api.post(`/coding/${id}/hint`);
};

export const submitCode = async (id, code) => {
  return api.post(`/coding/${id}/submit`, { code });
};
