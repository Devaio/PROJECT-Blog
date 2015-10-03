# Tags controller
mongoose = require 'mongoose'
Tag = mongoose.model('Tag')
Main = require './main'

class Tags extends Main

	constructor : () ->
		super(Tag)

	get : (req, res) ->
		super(req, res)

	delete : (req, res) ->
		super(req, res)

module.exports = new Tags()
