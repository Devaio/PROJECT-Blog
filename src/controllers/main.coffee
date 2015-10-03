# Main Controller
helpers = require '../modules/helpers'
mongoose = require 'mongoose'

module.exports = class Main

	constructor : (@model) ->

	get : (req, res, cb) =>
		cb = cb ? () ->
			
		if req.params.id
			@model.findOne {_id : req.params.id}, (err, data) ->
				res.send data
		else
			q = helpers.queryBuilder(req)
	
			@model.find(q.query).sort(q.sortQuery).exec (err, data) ->
				res.send data
				cb()


	delete : (req, res, cb) =>
		cb = cb ? () ->
		id = if req.params.id? then req.params.id else false

		if not id
			return res.send {error : "Please provide a user ID."}

		@model.findOneAndUpdate {_id : id}, {deleted : true}, (err, data) ->

			if err
				res.send err
			else
				res.send data
			cb()



	upsert: (data, req, res, cb) =>
		self = @
		cb = cb ? () ->
		if req.params.id?
			query = {_id : req.params.id}
			@model.update query, data, (err, data) ->
				if err
					console.log err
					res.send JSON.stringify({error : 'An error occured. Please try again.'})
				else
					res.send data

				cb()
		else
			console.log @model
			newModelInstance = new @model(data)
			newModelInstance.save (err, doc) ->
				if err
					console.log err
					res.send JSON.stringify({error : 'An error occured. Please try again.'})
				else
					res.send doc
				cb()
