# Accounts controller
mongoose = require 'mongoose'
Account = mongoose.model('Account')
Main = require './main'
class Accounts extends Main

	constructor : () ->
		super(Account)

	get : (req, res) ->
		super(req, res)

	delete : (req, res) ->
		super(req, res)

	upsert : (req, res) ->
		self = @
		body = req.body
		user = {}
		if body.pass1
			if not body.name or
				not body.email or
				not body.pass1 or
				not body.pass2 or
				body.pass1 isnt body.pass2
					res.send JSON.stringify({error : 'Please complete the form'})
					return
			user.password = body.pass1

		user.name = body.name
		user.email = body.email

		super user, req, res

	createAccount : (req, res) ->
		self = @
		body = req.body
		user = {}
		console.log req.body
		if body.pass1
			if not body.name or
				not body.email or
				not body.pass1 or
				not body.pass2 or
				body.pass1 isnt body.pass2
					res.send JSON.stringify({error : 'Please complete the form'})
					return
			user.password = body.pass1

		user.name = body.name
		user.email = body.email
		acc = new Account(user)
		acc.save () ->
			req.login acc, () ->
				res.redirect '/'
				
module.exports = new Accounts()
