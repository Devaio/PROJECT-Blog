# Tags controller
mongoose = require 'mongoose'
Tag = mongoose.model('Tag')
Main = require './main'

class Tags extends Main

	constructor : () ->
		super(Tag)

	get : (req, res) ->
		
		if req.query.name
			Tag.findOne {name : req.query.name}, (err, tag) ->
				if tag
					res.send tag
				else
					res.send {name : req.query.name}
		
		else
			Tag.find {}, (err, tags) ->
				res.send tags
		
	delete : (req, res) ->
		super(req, res)

module.exports = new Tags()
