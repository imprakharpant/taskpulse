const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');

/**
 * List all projects owned by user with search, filter, and pagination
 */
const listProjects = async (userId, query) => {
  const { search, status, sortBy = 'createdAt', order = 'desc', page = 1, limit = 50 } = query;

  const where = {
    userId
  };

  if (status) {
    where.status = status;
  }

  if (search && search.trim() !== '') {
    where.name = {
      contains: search.trim(),
      mode: 'insensitive'
    };
  }

  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: {
        [sortBy]: order
      },
      skip,
      take: limit,
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    }),
    prisma.project.count({ where })
  ]);

  return {
    projects,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Fetch a single project by ID with its tasks, scoped to user
 */
const getProjectById = async (userId, projectId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId
    },
    include: {
      tasks: {
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: { tasks: true }
      }
    }
  });

  if (!project) {
    // 404 rather than 403 prevents ID enumeration across tenants
    throw ApiError.notFound('Project not found');
  }

  return project;
};

/**
 * Create a new project for user
 */
const createProject = async (userId, data) => {
  const project = await prisma.project.create({
    data: {
      ...data,
      userId
    },
    include: {
      _count: {
        select: { tasks: true }
      }
    }
  });

  return project;
};

/**
 * Update an existing project owned by user
 */
const updateProject = async (userId, projectId, data) => {
  // Confirm project ownership
  const existing = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId
    }
  });

  if (!existing) {
    throw ApiError.notFound('Project not found');
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data,
    include: {
      _count: {
        select: { tasks: true }
      }
    }
  });

  return updated;
};

/**
 * Delete a project owned by user (cascades tasks)
 */
const deleteProject = async (userId, projectId) => {
  // Confirm project ownership
  const existing = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId
    }
  });

  if (!existing) {
    throw ApiError.notFound('Project not found');
  }

  await prisma.project.delete({
    where: { id: projectId }
  });

  return { message: 'Project and all associated tasks deleted successfully' };
};

module.exports = {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
