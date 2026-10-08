import client from './client';

export const getTasks = async (params = {}) => {
  return client.get('/tasks', { params });
};

export const getTaskById = async (id) => {
  return client.get(`/tasks/${id}`);
};

export const createTask = async (data) => {
  return client.post('/tasks', data);
};

export const updateTask = async (id, data) => {
  return client.put(`/tasks/${id}`, data);
};

export const deleteTask = async (id) => {
  return client.delete(`/tasks/${id}`);
};
