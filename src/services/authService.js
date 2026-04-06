const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const xss = require('xss');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const cleanEnv = (value, fallback = '') => {
  const raw = (value || fallback).toString();
  return raw.replace(/[\r\n]/g, '').trim().replace(/^['"]|['"]$/g, '');
};

const jwtSecret = cleanEnv(process.env.JWT_SECRET, 'replace_with_a_strong_secret');
const jwtExpiresIn = cleanEnv(process.env.JWT_EXPIRES_IN, '7d');

const createToken = (userId) =>
  jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpiresIn });

const register = async (payload) => {
  const firstName = xss(payload.firstName);
  const lastName = xss(payload.lastName);
  const email = payload.email.toLowerCase();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword
  });

  const token = createToken(user._id.toString());

  return {
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = createToken(user._id.toString());

  return {
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  };
};

module.exports = { register, login };
