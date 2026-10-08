const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerSchema, loginSchema } = require('../validators/auth.schema');

const router = Router();

router.post(
  '/register',
  authLimiter,
  validate(registerSchema, 'body'),
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validate(loginSchema, 'body'),
  authController.login
);

router.post(
  '/logout',
  authenticate,
  authController.logout
);

router.get(
  '/me',
  authenticate,
  authController.getMe
);

module.exports = router;
