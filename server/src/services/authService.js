const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  company: user.company,
  isActive: user.isActive,
});

const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: '7d' });

const register = async (payload) => {
  if (payload.role === 'admin') {
    if (!env.adminInviteCode || payload.adminInviteCode !== env.adminInviteCode) {
      throw new ApiError(403, 'A valid admin invite code is required');
    }
  }

  const existingUser = await User.findOne({ email: payload.email }).lean();
  if (existingUser) throw new ApiError(409, 'Email is already registered');

  const { adminInviteCode, ...userPayload } = payload;
  const user = await User.create(userPayload);
  return { token: signToken(user), user: publicUser(user) };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) throw new ApiError(403, 'Account is disabled');
  return { token: signToken(user), user: publicUser(user) };
};

module.exports = { login, publicUser, register };
