import client from './client';

export const getProjects = async (params = {}) => {
  return client.get('/projects', { params });
};

export const getProjectById = async (id) => {
  return client.get(`/projects/${id}`);
};

export const createProject = async (data) => {
  return client.post('/projects', data);
};

export const updateProject = async (id, data) => {
  return client.put(`/projects/${id}`, data);
};

export const deleteProject = async (id) => {
  return client.delete(`/projects/${id}`);
};
