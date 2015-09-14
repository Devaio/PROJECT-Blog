var passport, performLogin;

passport = require('passport');

performLogin = function(req, res, next, user) {
  req.login(user, function(err) {
    if (err) {
      return next(err);
    }
    return setTimeout(function() {
      return res.send({
        user: user
      });
    }, 5000);
  });
};

module.exports.login = function(req, res, next) {
  var authFunction;
  authFunction = passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send({
        error: 'No user!'
      });
    }
    performLogin(req, res, next, user);
  });
  return authFunction(req, res, next);
};
