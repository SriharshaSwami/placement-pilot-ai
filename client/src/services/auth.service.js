import api from '../lib/axios.js';

export const register = async (userData) => {
  return api.post('/auth/register', userData);
};

export const login = async (credentials) => {
  return api.post('/auth/login', credentials);
};

export const logout = async () => {
  return api.post('/auth/logout');
};

export const getMe = async () => {
  return api.get('/auth/me');
};
