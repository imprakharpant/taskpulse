const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const prisma = require('./config/db');

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server successfully started on port ${PORT} [NODE_ENV=${env.NODE_ENV}]`);
  logger.info(`Health check accessible at http://localhost:${PORT}/api/health`);
});

const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await prisma.$disconnect();
      logger.info('Prisma database client disconnected.');
    } catch (err) {
      logger.error('Error disconnecting Prisma client:', err);
    }
    process.exit(0);
  });

  // Force close after 10 seconds if not gracefully closed
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});
