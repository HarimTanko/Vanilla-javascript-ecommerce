const express = require('express');
const { body, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users.js');

const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPassword,
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  '/signup',
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(signupTemplate({ req, errors }));
    }

    const { email, password, passwordConfirmation } = req.body;

    //Create a user
    const user = await usersRepo.create({ email, password });

    //Store id of the user inside the users cookie
    req.session.userId = user.id;

    res.send('Account created masha allah');
  }
);

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  '/signin',
  requireEmailExists,
  requireValidPassword,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(signinTemplate({ errors }));
    }

    const { email } = req.body;

    // const user = await usersRepo.findOneBy({ email });

    //req.session.userId = user.id;

    res.send('Signed In');
  }
);

module.exports = router;
