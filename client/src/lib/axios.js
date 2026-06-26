import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';

    // Handle global errors here
    if (status === 401) {
      window.dispatchEvent(new Event('unauthorized'));
      toast.error('Session expired. Please log in again.');
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status === 404) {
      toast.error('Resource not found.');
    } else if (status === 409) {
      toast.error(message || 'A conflict occurred.');
    } else if (status === 422) {
      toast.error('Invalid data provided. Please check your inputs.');
    } else if (status === 429) {
      toast.error('Too many requests. Please try again later.');
    } else if (status >= 500) {
      toast.error('Server error. Our team has been notified.');
    } else if (status !== 400 && status !== 401) {
       // Only toast generic errors if it's not a 400/401 (400 is usually handled by the specific component form)
       toast.error(message);
    }

    return Promise.reject(error.response?.data || new Error(message));
  }
);

export default api;
