var Account, adminUser, env, fs, mongoose, newAdmin;

mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/clarissablog?slaveOk=true&connectTimeoutMS=10000');

fs = require('fs');

env = require('node-env-file');

if (typeof global.process.env.NODE_ENV === 'undefined') {
  if (fs.existsSync(__dirname + '/../../env/development.env')) {
    env(__dirname + '/../../env/development.env');
  }
}

require('../models/accounts');

Account = mongoose.model('Account');

console.log(Account);

adminUser = {
  email: global.process.env.ADMIN_EMAIL,
  password: global.process.env.ADMIN_PASSWORD
};

newAdmin = new Account(adminUser);

newAdmin.save(function(err, doc) {
  return console.log(err, doc);
});
