const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middleware/auth');

const router = Router();

// Dashboard route requires authentication
router.get('/', authenticate, dashboardController.getDashboard);

module.exports = router;
