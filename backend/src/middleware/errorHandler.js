const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log all non-operational or 500 errors with stack trace
  if (!(error instanceof ApiError) || error.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${error.message}`, { stack: error.stack });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${error.statusCode} ${error.message}`);
  }

  // Handle SyntaxError (bad JSON body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = ApiError.badRequest('Invalid JSON in request body');
  }

  // Handle JWT errors
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired');
  } else if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  }

  // Handle Prisma Database Errors
  if (err.code === 'P2002') {
    const target = err.meta?.target ? ` (${err.meta.target.join(', ')})` : '';
    error = ApiError.conflict(`A record with this unique field already exists${target}`);
  } else if (err.code === 'P2025') {
    error = ApiError.notFound(err.meta?.cause || 'Record not found');
  } else if (err.code === 'P2003') {
    error = ApiError.badRequest('Foreign key constraint failed');
  }

  // Default to 500 if not an ApiError instance
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  const response = {
    message: statusCode === 500 && env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred'
      : message
  };

  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  if (env.NODE_ENV === 'development' && statusCode === 500 && error.stack) {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
