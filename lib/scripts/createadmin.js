var Account, adminUser, mongoose, newAdmin;

mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/clarissablog?slaveOk=true&connectTimeoutMS=10000');

require('../models/accounts');

Account = mongoose.model('Account');

console.log(Account);

adminUser = {
  email: 'test@test.com',
  password: 'test'
};

newAdmin = new Account(adminUser);

newAdmin.save(function(err, doc) {
  return console.log(err, doc);
});
