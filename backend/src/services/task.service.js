const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');

/**
 * List tasks for projects owned by the user with search and filtering
 */
const listTasks = async (userId, query) => {
  const {
    projectId,
    search,
    status,
    priority,
    sortBy = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 50
  } = query;

  // Base scope: Only tasks whose parent project belongs to this user
  const where = {
    project: {
      userId
    }
  };

  if (projectId) {
    where.projectId = projectId;
  }

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  if (search && search.trim() !== '') {
    where.name = {
      contains: search.trim(),
      mode: 'insensitive'
    };
  }

  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: {
        [sortBy]: order
      },
      skip,
      take: limit,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      }
    }),
    prisma.task.count({ where })
  ]);

  return {
    tasks,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Fetch a single task by ID, verified through project ownership
 */
const getTaskById = async (userId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        userId
      }
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          status: true
        }
      }
    }
  });

  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  return task;
};

/**
 * Create a new task within a project owned by user
 */
const createTask = async (userId, data) => {
  const { projectId, ...taskData } = data;

  // Verify the target project belongs to this user
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId
    }
  });

  if (!project) {
    throw ApiError.notFound('Target project not found');
  }

  const task = await prisma.task.create({
    data: {
      ...taskData,
      projectId
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          status: true
        }
      }
    }
  });

  return task;
};

/**
 * Update an existing task owned by user
 */
const updateTask = async (userId, taskId, data) => {
  // Confirm task ownership through project
  const existing = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        userId
      }
    }
  });

  if (!existing) {
    throw ApiError.notFound('Task not found');
  }

  // If moving task to a different project, verify ownership of new project
  if (data.projectId && data.projectId !== existing.projectId) {
    const targetProject = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        userId
      }
    });

    if (!targetProject) {
      throw ApiError.notFound('Target destination project not found');
    }
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data,
    include: {
      project: {
        select: {
          id: true,
          name: true,
          status: true
        }
      }
    }
  });

  return updated;
};

/**
 * Delete a task owned by user
 */
const deleteTask = async (userId, taskId) => {
  // Confirm task ownership through project
  const existing = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        userId
      }
    }
  });

  if (!existing) {
    throw ApiError.notFound('Task not found');
  }

  await prisma.task.delete({
    where: { id: taskId }
  });

  return { message: 'Task deleted successfully' };
};

module.exports = {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
