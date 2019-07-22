const jwt = require('jsonwebtoken');

const getSignedJWT = payload => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      'secret',
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) reject(err);
        else {
          resolve(token);
        }
      }
    );
  });
};

const isEmpty = value => {
  return (
      value === undefined ||
      value === null ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (typeof value === 'string' && value.trim().length === 0)
  );
}

module.exports = {
  isEmpty,
  getSignedJWT,
}
