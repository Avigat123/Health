import axios from 'axios';

/**
 * Resolves the API base URL:
 * - If import.meta.env.VITE_API_URL is configured (e.g. 'https://healthvault-backend-ydqk.onrender.com'),
 *   formats it cleanly to append '/api' without duplicate slashes.
 * - If not configured or empty, falls back to '/api' so local Vite development proxy forwards to backend.
 */
const resolveBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || !envUrl.trim()) {
    return '/api';
  }
  const clean = envUrl.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 30000,
  withCredentials: true,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hv_token');
      localStorage.removeItem('hv_user');
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  }
);

export default api;
