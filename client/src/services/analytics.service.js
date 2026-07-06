import api from '../lib/axios.js';

export const getAnalyticsDashboard = async (timeframe = '30d') => {
  return api.get(`/analytics?timeframe=${timeframe}`);
};

export const getRecommendations = async () => {
  return api.get('/analytics/recommendations');
};
