const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' }
      ]
    });

    global.prisma.$on('error', (e) => {
      logger.error(`Prisma Error: ${e.message}`);
    });

    global.prisma.$on('warn', (e) => {
      logger.warn(`Prisma Warning: ${e.message}`);
    });
  }
  prisma = global.prisma;
}

module.exports = prisma;
