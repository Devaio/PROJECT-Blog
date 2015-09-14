# Main Controller
helpers = require '../modules/helpers'
mongoose = require 'mongoose'

module.exports = class Main

	constructor : (@model) ->

	get : (req, res, cb) =>
		cb = cb ? () ->
		q = helpers.queryBuilder(req)

		@model.find(q.query).sort(q.sortQuery).exec (err, data) ->
			res.send {data : data}
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
				res.send {data : data}
			cb()



	upsert: (data, req, res, cb) =>
		cb = cb ? () ->
		if req.params.id?
			query = {_id : req.params.id}
			@model.update query, data, (err, data) ->
				if err
					console.log err
					res.send JSON.stringify({error : 'An error occured. Please try again.'})
				else
					res.send {data : data}

				cb()
		else
			newModelInstance = new @model(data)
			newModelInstance.save (err, doc) ->
				if err
					console.log err
					res.send JSON.stringify({error : 'An error occured. Please try again.'})
				else
					res.send {data : doc}
				cb()
