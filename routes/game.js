const express = require('express');
const router = express.Router();
const passport = require('passport');

const Result = require('../models/Result');

router.get(
  '/result',
  (req, res) => {
    Result.findOne({ user: req.user })
      .then(result => {
        if (!result) {
          return res.json([]);
        }
        res.json(result.results);
      })
      .catch(err => res.status(404).json('Result Finding Error'));
  }
);
router.post(
  '/result', 
  (req, res) => {
    Result.findOne({user: req.user})
    .then(async result => {
      if (!result) {
        let newResult = new Result({
          user: req.user,
          results: [{
            nBlack: req.body.nBlack,
            nWhite: req.body.nWhite,
            finalTime: req.body.finalTime,
          }],
        });
        await newResult.save();
      }
      else
      {
        result.results.push({
          nBlack: req.body.nBlack,
          nWhite: req.body.nWhite,
          finalTime: req.body.finalTime,
        })
        await result.save();
      }
    }).catch(err => console.log(err))
  }
);

module.exports = router;
