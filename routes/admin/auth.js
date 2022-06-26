const usersRepo = require('../../repositories/users.js');
const express = require('express');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('home');
});

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.findOneBy({ email });

  if (existingUser) {
    return res.send('Email is already in use');
  }

  if (password !== passwordConfirmation) {
    return res.send('Passwords do not match salam');
  }

  //Create a user
  const user = await usersRepo.create({ email, password });

  //Store id of the user inside the users cookie
  req.session.userId = user.id;

  res.send('Account created masha allah');
});

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

router.get('/signin', (req, res) => {
  res.send('kai');
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.findOneBy({ email });

  if (!user) {
    return res.send('Email not found');
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );

  if (!validPassword) {
    return res.send('Incorrect password');
  }

  req.session.useId = user.id;

  res.send('Signed In');
});

module.exports = router;
