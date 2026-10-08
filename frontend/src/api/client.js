import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request interceptor: attach Bearer token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 token expiration and network errors
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      // Network failure / server offline
      return Promise.reject({
        message: 'Unable to reach the server. Please check your network connection or try again later.'
      });
    }

    const { status, config } = error.response;
    const isAuthEndpoint = config?.url?.includes('/auth/login') || config?.url?.includes('/auth/register');

    if (status === 401 && !isAuthEndpoint) {
      // Clear token and notify user via URL query
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=1';
      }
    }

    return Promise.reject(error.response.data || { message: 'An unexpected error occurred' });
  }
);

export default client;
