const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.validated.body);
  res.status(201).json({ success: true, data: result });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated.body);
  res.json({ success: true, data: result });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: authService.publicUser(req.user) } });
});

module.exports = { login, me, register };
