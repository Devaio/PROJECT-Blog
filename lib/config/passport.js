var Account, LocalStrategy, mongoose, passwords;

mongoose = require('mongoose');

Account = mongoose.model('Account');

passwords = require('../modules/passwords');

LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    return done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    return done(null, obj);
  });
  return passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(email, password, done) {
    return Account.findOne({
      email: email
    }, function(error, account) {
      if (!error && account) {
        return passwords.compare(password, account.password, function(isMatch) {
          if (!isMatch) {
            done(false, false);
            return;
          }
          account.password = false;
          return done(null, account);
        });
      } else {
        return done(false);
      }
    });
  }));
};
