const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send(`
    <form method="POST">
        <input name='email' placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="confirm password" />
        <button>Sign up</button>
    </form>

  `);
});

app.post('/', (req, res) => {
  res.send('Account creacted insha allah');
});

app.listen(3000, () => {
  console.log('listening on port 3000 ');
});
