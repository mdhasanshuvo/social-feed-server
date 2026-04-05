const { body } = require('express-validator');

const registerValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ min: 2, max: 50 }),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ min: 2, max: 50 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 6, max: 64 })
    .withMessage('Password must be between 6 and 64 characters')
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').trim().notEmpty().withMessage('Password is required')
];

module.exports = { registerValidator, loginValidator };
