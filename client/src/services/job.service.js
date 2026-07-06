import api from '../lib/axios.js';

export const createJob = async (jobData) => {
  return api.post('/jobs', jobData);
};

export const getJobs = async (resumeId = null) => {
  return api.get(resumeId ? `/jobs?resumeId=${resumeId}` : '/jobs');
};

export const getJob = async (id) => {
  return api.get(`/jobs/${id}`);
};

export const updateJob = async (id, updateData) => {
  return api.patch(`/jobs/${id}`, updateData);
};

export const deleteJob = async (id) => {
  return api.delete(`/jobs/${id}`);
};
