const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const config = require('./db');

const users = require('./routes/user');
const game = require('./routes/game');
const setJWTStrategy = require('./passport');
const authenticationMiddleware = require('./middleware/auth');

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {
    console.log('Database is connected');
  },
  err => {
    console.log('Can not connect to the database' + err);
  }
);
mongoose.set('useFindAndModify', false);

const app = express();
app.use(passport.initialize());

setJWTStrategy(passport);

app.use(bodyParser.json());
app.use(cors());

app.use(authenticationMiddleware);
app.use('/api/user', users);
app.use('/api/game', game);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
