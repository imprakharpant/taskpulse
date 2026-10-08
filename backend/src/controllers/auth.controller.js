const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    data: result
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json({
    data: result
  });
});

const logout = asyncHandler(async (req, res) => {
  // Stateless JWT: client removes token from storage.
  res.status(200).json({
    message: 'Logged out successfully'
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json({
    data: { user }
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe
};
