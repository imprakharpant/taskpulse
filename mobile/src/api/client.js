import axios from 'axios';
import { getToken, clearToken } from '../utils/secureStorage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach stored token to every request
client.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
client.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (!error.response) {
      // Network failure / server unreachable
      return Promise.reject({
        message: 'No internet connection. Please check your network.',
        isNetworkError: true,
      });
    }

    const { status, config } = error.response;
    const isAuthEndpoint =
      config?.url?.includes('/auth/login') ||
      config?.url?.includes('/auth/register');

    if (status === 401 && !isAuthEndpoint) {
      await clearToken();
      // Signal to AuthContext that session has expired
      return Promise.reject({
        message: error.response.data?.message || 'Session expired',
        isSessionExpired: true,
      });
    }

    return Promise.reject(
      error.response.data || { message: 'An unexpected error occurred' }
    );
  }
);

export default client;
