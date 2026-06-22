const { z } = require('zod');
const adminService = require('../services/adminService');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const objectId = z.string().regex(/^[a-f\d]{24}$/i);

const listUsers = asyncHandler(async (req, res) => {
  const users = await adminService.listUsers(req.query.role);
  res.json({ success: true, data: users });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const schema = z.object({
    params: z.object({ id: objectId }),
    body: z.object({ isActive: z.boolean() }),
  });
  const parsed = schema.safeParse({ params: req.params, body: req.body });
  if (!parsed.success) throw new ApiError(400, 'Validation failed', parsed.error.flatten());

  const user = await adminService.updateUserStatus(parsed.data.params.id, parsed.data.body.isActive);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: user });
});

const analytics = asyncHandler(async (req, res) => {
  const data = await adminService.getAnalytics();
  res.json({ success: true, data });
});

module.exports = { analytics, listUsers, updateUserStatus };
