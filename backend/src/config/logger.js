const winston = require('winston');
const env = require('./env');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  env.NODE_ENV === 'development'
    ? winston.format.colorize({ all: true })
    : winston.format.uncolorize(),
  winston.format.printf(
    (info) => `[${info.timestamp}] [${info.level}]: ${info.message}${info.stack ? '\n' + info.stack : ''}`
  )
);

const transports = [
  new winston.transports.Console()
];

const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports
});

// Stream object for Morgan integration
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

module.exports = logger;
