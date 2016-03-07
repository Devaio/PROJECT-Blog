# Comments controller
mongoose = require 'mongoose'
async = require 'async'
Post = mongoose.model('Post')
Comment = mongoose.model('Comment')
Main = require './main'
moment = require 'moment'

# Date Conversion helper methods
toReadableDate = (doc) ->
	doc.createdAt = moment.unix(doc.createdAt).format('MMM DD, YYYY')

toUnixDate = (doc) ->
	doc.createdAt = moment(doc.createdAt).format('X')
	
toJSDate = (doc) ->
	doc.createdAt = moment.unix(doc.createdAt).toDate()


class Comments extends Main

	constructor : () ->
		super(Comment)

	get : (req, res) ->		
		super(req, res)

	createComment : (req, res) ->
		self = @
		body = req.body
		
		console.log('Comment BODY', body)
		# if not body.content or
		# 	not body.title 
		# 		res.send {error : 'Please complete the form'}
		# 		return
		body.post = req.params.postID
		newComment = new Comment(body)
		newComment.save (err, doc) ->
			console.log err, doc
			if err
				res.send err
			else
				Post.findOne {_id : req.params.postID}, (err, foundPost) ->
					foundPost.comments = foundPost.comments || []
					foundPost.comments.push(doc._id)
					foundPost.save()
					res.send doc
			
			# super(body, req, res)
	
	delete : (req, res) ->
		super(req, res)
module.exports = new Comments()
