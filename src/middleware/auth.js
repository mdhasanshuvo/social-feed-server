const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const cleanEnv = (value, fallback = '') => {
  const raw = (value || fallback).toString();
  return raw.replace(/[\r\n]/g, '').trim().replace(/^['"]|['"]$/g, '');
};

const jwtSecret = cleanEnv(process.env.JWT_SECRET, 'replace_with_a_strong_secret');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId).select('_id firstName lastName email');
    if (!user) {
      throw new ApiError(401, 'Unauthorized');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
});

module.exports = authMiddleware;
