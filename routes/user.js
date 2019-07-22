const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const getSignedJWT = require('../utils').getSignedJWT;

const User = require('../models/User');

router.post('/register', function(req, res) {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    email: req.body.email,
  }).then(user => {
    if (user) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.error('There was an error', err);
        else {
          bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) console.error('There was an error', err);
            else {
              newUser.password = hash;
              try {
                let user = await newUser.save();
                const token = await getSignedJWT({
                  id: user.id,
                  name: user.name,
                });
                res.json({
                  token,
                });
              } catch (err) {
                return res.status(500).json({
                  ...errors,
                  message: 'Internal Error',
                });
              }
            }
          });
        }
      });
    }
  });
});

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.message = 'User not found';
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then(async isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
        };
        try {
          const token = await getSignedJWT(payload);
          res.json({
            success: true,
            token: `Bearer ${token}`,
          });
        } catch (err) {
          return res.status(500).json({
            ...errors,
            message: 'Internal Error',
          });
        }
      } else {
        errors.message = 'Incorrect Password';
        return res.status(400).json(errors);
      }
    });
  });
});

router.get('/profile', (req, res) => {
  return res.json({
    name: req.user.name,
    email: req.user.email,
  });
});

router.post('/modify', (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      email: req.body.email,
      name: req.body.name,
    },
    {
      new: true,
    }
  )
    .exec()
    .then(user => {
      console.log(user);
      res.json({
        name: user.name,
        email: user.email,
      });
    })
    .catch(err => {
      return res.status(500).json({ message: 'Internal Sever Error' });
    });
});

module.exports = router;
