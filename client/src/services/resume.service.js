import api from '../lib/axios.js';

export const uploadResume = async (file, title, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);

  return api.post('/resumes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const getResumes = async () => {
  return api.get('/resumes');
};

export const getResume = async (id) => {
  return api.get(`/resumes/${id}`);
};

export const renameResume = async (id, title) => {
  return api.patch(`/resumes/${id}`, { title });
};

export const setPrimaryResume = async (id) => {
  return api.patch(`/resumes/${id}/primary`);
};

export const deleteResume = async (id) => {
  return api.delete(`/resumes/${id}`);
};

export const parseResume = async (id) => {
  return api.post(`/resumes/${id}/parse`);
};
