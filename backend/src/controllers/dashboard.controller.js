const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats(req.user.id);
  res.status(200).json({
    data: stats
  });
});

module.exports = {
  getDashboard
};
