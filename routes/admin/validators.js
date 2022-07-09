const { body } = require('express-validator');
const usersRepo = require('../../repositories/users.js');

module.exports = {
  requireTitle: body('title')
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage('Must be between 5 and 40 characters'),
  requirePrice: body('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('Must be a number greater than 1'),
  requireEmail: body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be valid email')
    .custom(async (email) => {
      const existingUser = await usersRepo.findOneBy({ email });
      if (existingUser) {
        throw new Error('Email in use');
      }
    }),
  requirePassword: body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
  requirePasswordConfirmation: body('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
    .custom(async (passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords do not match');
      }
    }),

  requireEmailExists: body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide an email')
    .custom(async (email) => {
      const user = await usersRepo.findOneBy({ email });

      if (!user) {
        throw new Error('Email not found');
      }
    }),

  requireValidPassword: body('password')
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.findOneBy({ email: req.body.email });
      if (!user) {
        throw new Error('Invalid password');
      }
      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
      );

      if (!validPassword) {
        throw new Error('Invalid password');
      }
    }),
};
