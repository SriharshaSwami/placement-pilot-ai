import api from '../lib/axios.js';

export const getAnalyticsDashboard = async () => {
  return api.get('/analytics');
};
