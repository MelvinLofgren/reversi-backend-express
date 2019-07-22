const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statusSchema = new Schema({
    nBlack: {
      type: Number,
      min: 0,
      max: 64,
    },
    nWhite: {
      type: Number,
      min: 0,
      max: 64,
    },
    finalTime: Date,
});

const ResultSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  results: [statusSchema],
});

const Result = mongoose.model('Result', ResultSchema);

module.exports = Result;
