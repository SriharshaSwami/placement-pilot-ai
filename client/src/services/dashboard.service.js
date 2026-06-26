import api from '../lib/axios.js';

export const getDashboardData = async () => {
  const response = await api.get('/dashboard');
  return response; // Note: Interceptor already returns response.data
};
