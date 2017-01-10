#Passport Configuration
mongoose = require 'mongoose'
Account = mongoose.model('Account')
passwords = require '../modules/passwords'
LocalStrategy = require('passport-local').Strategy

module.exports = (passport) ->
	
	passport.serializeUser (user, done) ->
	  done(null, user)

	passport.deserializeUser (obj, done) ->
	  done(null, obj)

	# Local
	passport.use new LocalStrategy {
		usernameField: 'email',
		passwordField: 'password'

	}, (email, password, done) ->
		console.log(email, password)
		Account.findOne {email : email}, (error, account) ->
			console.log error, account
			if not error and account

				passwords.compare password, account.password, (isMatch) ->
					if not isMatch
						done(false, false)
						return
					# remove password from session for security
					account.password = false

					done(null, account)
			else
				done(false)

