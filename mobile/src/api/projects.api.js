import client from './client';

export const getProjects = (params) => client.get('/projects', { params });
export const getProjectById = (id) => client.get(`/projects/${id}`);
export const createProject = (data) => client.post('/projects', data);
export const updateProject = (id, data) => client.put(`/projects/${id}`, data);
export const deleteProject = (id) => client.delete(`/projects/${id}`);
