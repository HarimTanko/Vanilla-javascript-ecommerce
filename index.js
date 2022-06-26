const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['12344'] }));

app.get('/signup', (req, res) => {
  res.send(`
  <div>
    Your id is: ${req.session.userId}
    <form method="POST">
        <input name='email' placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="confirm password" />
        <button>Sign up</button>
    </form>
    </div>
  `);
});

// const bodyParser = (req, res, next) => {
//   if (req.method === 'POST') {
//     req.on('data', (data) => {
//       const parsed = data.toString('utf8').split('&');

//       let formData = {};

//       for (let pair of parsed) {
//         const [key, value] = pair.split('=');

//         formData[key] = value;
//       }
//       req.body = formData;
//       next();
//     });
//   } else {
//     next();
//   }
// };

app.post('/signup', async (req, res) => {
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

app.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

app.listen(3000, () => {
  console.log('listening on port 3000 ');
});
