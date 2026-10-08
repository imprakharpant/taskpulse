const rateLimit = require('express-rate-limit');
const ApiError = require('../utils/ApiError');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 attempts per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    next(
      ApiError.tooManyRequests(
        'Too many authentication attempts from this IP address. Please try again after 15 minutes.'
      )
    );
  }
});

module.exports = {
  authLimiter
};
