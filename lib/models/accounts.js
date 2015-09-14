var Schema, accounts, mongoose, passwords;

mongoose = require('mongoose');

Schema = mongoose.Schema;

passwords = require('../modules/passwords');

accounts = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: String
});

accounts.pre('save', function(next) {
  var user;
  if (!this.isModified('password')) {
    return next();
  }
  user = this;
  user.password = passwords.encrypt(user.password);
  next();
});

mongoose.model('Account', accounts);
