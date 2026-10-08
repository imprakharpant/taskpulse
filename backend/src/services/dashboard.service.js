const prisma = require('../config/db');

/**
 * Fetch aggregated dashboard analytics for the authenticated user
 * All queries execute concurrently in a single Promise.all roundtrip
 *
 * Metric definitions:
 * - totalProjects: All projects belonging to the user
 * - totalTasks: All tasks within projects belonging to the user
 * - completedTasks: Tasks with status === 'COMPLETED'
 * - pendingTasks: Tasks with status === 'PENDING' (strictly PENDING, excludes IN_PROGRESS)
 * - projectsInProgress: Projects with status === 'IN_PROGRESS'
 */
const getDashboardStats = async (userId) => {
  const [
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    projectsInProgress
  ] = await Promise.all([
    // Total projects owned by user
    prisma.project.count({
      where: { userId }
    }),

    // Total tasks in projects owned by user
    prisma.task.count({
      where: {
        project: { userId }
      }
    }),

    // Completed tasks
    prisma.task.count({
      where: {
        status: 'COMPLETED',
        project: { userId }
      }
    }),

    // Pending tasks (strictly status PENDING)
    prisma.task.count({
      where: {
        status: 'PENDING',
        project: { userId }
      }
    }),

    // Projects currently In Progress
    prisma.project.count({
      where: {
        status: 'IN_PROGRESS',
        userId
      }
    })
  ]);

  return {
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    projectsInProgress
  };
};

module.exports = {
  getDashboardStats
};
