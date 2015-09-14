var crypto;

crypto = require('crypto');

exports.encrypt = function(password) {
  return crypto.createHash('sha512').update(password).digest('hex');
};

exports.compare = function(password, userPassword, cb) {
  if (this.encrypt(password) === userPassword) {
    return cb(true);
  } else {
    return cb(false);
  }
};
