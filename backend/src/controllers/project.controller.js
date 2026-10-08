const projectService = require('../services/project.service');
const asyncHandler = require('../utils/asyncHandler');

const getProjects = asyncHandler(async (req, res) => {
  const result = await projectService.listProjects(req.user.id, req.query);
  res.status(200).json({
    data: result.projects,
    meta: result.meta
  });
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.user.id, req.params.id);
  res.status(200).json({
    data: project
  });
});

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.user.id, req.body);
  res.status(201).json({
    data: project
  });
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.user.id, req.params.id, req.body);
  res.status(200).json({
    data: project
  });
});

const deleteProject = asyncHandler(async (req, res) => {
  const result = await projectService.deleteProject(req.user.id, req.params.id);
  res.status(200).json(result);
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
