
mongoose = require 'mongoose'
mongoose.connect('mongodb://localhost/clarissablog?slaveOk=true&connectTimeoutMS=10000')
 
require '../models/accounts'
Account = mongoose.model('Account')

console.log Account

adminUser = {
	email : 'test@test.com',
	password : 'test'
}

newAdmin = new Account(adminUser)

newAdmin.save (err, doc) ->
	console.log err, doc