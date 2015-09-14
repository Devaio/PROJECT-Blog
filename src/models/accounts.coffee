# Accounts Model

mongoose = require 'mongoose'
Schema = mongoose.Schema
passwords = require '../modules/passwords'

#Account Collection
accounts = new Schema
	name : String,
	email : {type : String, required : true, unique : true},
	password : {type : String, required : true},
	role : String
	
accounts.pre 'save', (next) ->
	# First, check to see if the password has been modified. If not, just move on.
	if !@isModified('password')
		return next()
	# Store access to "this", which represents the current user document
	user = this
	user.password = passwords.encrypt user.password
	next()
	return
	

mongoose.model 'Account', accounts