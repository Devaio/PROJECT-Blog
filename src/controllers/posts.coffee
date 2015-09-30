# Posts controller
mongoose = require 'mongoose'
async = require 'async'
Post = mongoose.model('Post')
Tag = mongoose.model('Tag')
Main = require './main'

createTagList = (newPostTags, cb) ->
	tasks = []
	tagList = []
	Tag.find {name : {$in : newPostTags}}, (err, tags) ->
		# console.log err
		# Create list of tag names that already exists
		createdTagNames = tags.map (tag) ->
			return tag.name
		
		# Loop over tags and create a new tag if it doesn't exist
		for tag in newPostTags
			do (tag) ->
				tasks.push (cb) ->
					tagIndex = createdTagNames.indexOf(tag)
					if tagIndex is -1
						console.log 'TASK'
						createTag = new Tag({name : tag})
						createTag.save (err, doc) ->
							# console.log err
							tagList.push doc._id
							cb()
					else
						tagList.push tags[tagIndex]._id
						cb()
					
		async.series tasks, () ->
			console.log 'NT', tagList
			# Return Array of NEW tag Id's
			cb(tagList)
			

class Posts extends Main

	constructor : () ->
		super(Post)

	get : (req, res) ->
		
		Post.find({}).populate('tags').exec (err, posts) ->
			res.send posts
		
		# super(req, res)

	getTags : (req, res) ->
		Tag.find {}, (err, tags) ->
			res.send tags

	delete : (req, res) ->
		super(req, res)

	createPost : (req, res) ->
		self = @
		body = req.body
		
		console.log('POST BODY', body)
		# if not body.content or
		# 	not body.title 
		# 		res.send {error : 'Please complete the form'}
		# 		return
				
		body.tags = body.tags.map (tag) ->
			return tag.toLowerCase()
		createTagList body.tags, (tagList) ->
			body.tags = tagList
			
			
			newPost = new Post(body)
			newPost.save (err, doc) ->
				console.log err, doc
				res.send doc
			
			# super(body, req, res)
	updatePost : (req, res) ->
		Post.update {_id : req.params.id}, req.body, (err, post) ->
			
			Post.findOne {_id : req.params.id}, (err, post) ->
				res.send post
				
module.exports = new Posts()
