import api from '../lib/axios.js';

export const getProfile = async () => {
  return api.get('/career/profile');
};

export const updateProfile = async (data) => {
  return api.put('/career/profile', data);
};

export const getRoadmap = async (force = false) => {
  return api.get(`/career/roadmap?force=${force}`);
};

export const updateTaskStatus = async (taskId, status) => {
  return api.patch(`/career/roadmap/tasks/${taskId}`, { status });
};
