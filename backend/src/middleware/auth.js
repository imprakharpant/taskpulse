const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

/**
 * Authentication middleware that verifies JWT Bearer token
 * Returns distinct 401 'Token expired' message on expiration so clients can initiate redirect.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      ApiError.unauthorized('Authentication required. Missing or malformed Bearer token.')
    );
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(ApiError.unauthorized('Authentication required. Token is missing.'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: decoded.sub };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expired'));
    }
    return next(ApiError.unauthorized('Invalid token'));
  }
};

module.exports = authenticate;
