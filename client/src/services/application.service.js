import api from '../lib/axios.js';

export const getDashboardStats = async () => {
  return api.get('/applications/stats');
};

export const createApplication = async (data) => {
  return api.post('/applications', data);
};

export const getApplications = async (query = {}) => {
  const params = new URLSearchParams(query).toString();
  return api.get(`/applications?${params}`);
};

export const getApplication = async (id) => {
  return api.get(`/applications/${id}`);
};

export const updateApplication = async (id, data) => {
  return api.patch(`/applications/${id}`, data);
};

export const deleteApplication = async (id) => {
  return api.delete(`/applications/${id}`);
};

export const generateInsights = async (id) => {
  return api.post(`/applications/${id}/insights`);
};
