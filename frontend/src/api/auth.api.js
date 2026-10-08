import client from './client';

export const register = async (data) => {
  return client.post('/auth/register', data);
};

export const login = async (data) => {
  return client.post('/auth/login', data);
};

export const logout = async () => {
  try {
    await client.post('/auth/logout');
  } catch (e) {
    // Gracefully handle logout failure
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getMe = async () => {
  return client.get('/auth/me');
};
