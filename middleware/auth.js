const passport = require('passport');

module.exports = function authenticationMiddleware(req, res, next) {
  const whiteList = ['/api/user/login', '/api/user/register'];
  if (whiteList.includes(req.originalUrl)) {
    next();
  } else {
    passport.authenticate('jwt', { session: false })(req, res, next);
  }
};
