const ApiError = require('../utils/ApiError');

/**
 * Express middleware to validate request payload against a Zod schema
 * @param {import('zod').ZodSchema} schema - Zod validation schema
 * @param {'body' | 'query' | 'params'} source - Request property to validate ('body', 'query', or 'params')
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const parsed = schema.parse(req[source]);
    req[source] = parsed; // Replace with sanitized/transformed data
    next();
  } catch (error) {
    if (error.errors && Array.isArray(error.errors)) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return next(ApiError.badRequest('Validation failed', formattedErrors));
    }
    next(error);
  }
};

module.exports = validate;
