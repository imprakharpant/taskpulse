/**
 * Wraps async route handlers to catch uncaught promises and route them to express error middleware
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
