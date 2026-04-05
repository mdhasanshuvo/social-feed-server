const authService = require('../services/authService');

const register = async (req, res) => {
  const data = await authService.register(req.body);
  return res.status(201).json({ success: true, message: 'Registration successful', data });
};

const login = async (req, res) => {
  const data = await authService.login(req.body);
  return res.status(200).json({ success: true, message: 'Login successful', data });
};

module.exports = { register, login };
