const taskService = require('../services/task.service');
const asyncHandler = require('../utils/asyncHandler');

const getTasks = asyncHandler(async (req, res) => {
  const result = await taskService.listTasks(req.user.id, req.query);
  res.status(200).json({
    data: result.tasks,
    meta: result.meta
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.user.id, req.params.id);
  res.status(200).json({
    data: task
  });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user.id, req.body);
  res.status(201).json({
    data: task
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
  res.status(200).json({
    data: task
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteTask(req.user.id, req.params.id);
  res.status(200).json(result);
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
