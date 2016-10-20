# Comments controller
mongoose = require 'mongoose'
async    = require 'async'
Post     = mongoose.model 'Post'
Comment  = mongoose.model 'Comment'
_        = require 'lodash'
Main     = require './main'
moment   = require 'moment'
fs       = require 'fs'
Mailer   = require '../modules/mailer'

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
		# super(req, res)
		Comment.find({approved : false}).sort('post').populate('post').exec (err, docs) ->
			console.log(err, docs)
			groupedComments = _.groupBy docs, (doc) ->
				doc.post.title
			res.send groupedComments

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
				commentText = fs.readFileSync __dirname + '../../comments.txt', 'utf-8'
				fs.writeFileSync __dirname + '../../comments.txt', commentText + '\n ' + JSON.stringify(body)
				
			else
				if doc.isSubComment
					res.send doc
					if doc.sendEmail is true and body.parentComment.email?
						Mailer.send '651f0a1f-81a9-49ab-9b78-9e801d23c914', [ 
							{
								name: '%name%'
								content: "<h2>" + doc.name + "</h2>"
							},
							{
								name: '%comment%'
								content: "<h4>" + doc.content + "</h4>"
							}
						], {
							to: body.parentComment.email
							from: 'services@theviewfromhere.is'
						}, (err, response) ->
							if err
								console.log 'BAD EMAIL', err
							else
								console.log('GOOD EMAIL', response)
					
				else
					Post.findOne {_id : req.params.postID}, (err, foundPost) ->
						foundPost.comments = foundPost.comments || []
						foundPost.comments.push(doc._id)
						foundPost.save()
						res.send doc
			
			# super(body, req, res)
	updateComment : (req, res) ->
		body = req.body
		Comment.findOneAndUpdate {_id : req.params.id}, body, {new : true}, (err, doc) ->
			res.send doc
		
			if doc.isSubComment
				console.log(doc._id)
				Comment.findOne {subComments : doc._id }, (err, parentComment) ->
				
					console.log(err, parentComment)
					
					if parentComment? and parentComment.sendEmail is true and parentComment.email?
						Mailer.send '651f0a1f-81a9-49ab-9b78-9e801d23c914', [ 
							{
								name: '%name%'
								content: "<h2>" + doc.name + "</h2>"
							},
							{
								name: '%comment%'
								content: "<h4>" + doc.content + "</h4>"
							}
						], {
							to: parentComment.email
							from: 'services@theviewfromhere.is'
						}, (err, response) ->
							if err
								console.log 'BAD EMAIL', err
							else
								console.log('GOOD EMAIL', response)
	
	delete : (req, res) ->
		Comment.remove {_id : req.params.id}, (err, rmv) ->
			res.send rmv
module.exports = new Comments()
