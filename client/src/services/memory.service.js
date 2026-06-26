import api from '../lib/axios.js';

export const getMemories = async () => {
  return api.get('/memory');
};

export const deleteMemory = async (id) => {
  return api.delete(`/memory/${id}`);
};

export const resetMemories = async () => {
  return api.delete('/memory');
};

export const exportMemories = async () => {
  const response = await api.get('/memory/export', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'placementpilot_memory.json');
  document.body.appendChild(link);
  link.click();
  link.remove();
};
