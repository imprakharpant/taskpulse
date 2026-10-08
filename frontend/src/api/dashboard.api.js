import client from './client';

export const getDashboard = async () => {
  return client.get('/dashboard');
};
