
mongoose = require 'mongoose'
mongoose.connect('mongodb://localhost/clarissablog?slaveOk=true&connectTimeoutMS=10000')
 
fs = require 'fs'
env = require 'node-env-file'

# Read evironment vars from file if no environment exists
# Load ENV vars
if typeof(global.process.env.NODE_ENV) is 'undefined'
	if fs.existsSync(__dirname + '/../../env/development.env')
		env(__dirname + '/../../env/development.env')

 
require '../models/accounts'
Account = mongoose.model('Account')

console.log Account

adminUser = {
	email : 'test@test.com',
	# email : global.process.env.ADMIN_EMAIL,
	# password : global.process.env.ADMIN_PASSWORD,
	password : 'test'
}

newAdmin = new Account(adminUser)

newAdmin.save (err, doc) ->
	console.log err, doc