# Posts controller
mongoose = require 'mongoose'
async = require 'async'
Post = mongoose.model('Post')
Tag = mongoose.model('Tag')
Main = require './main'
moment = require 'moment'
_ = require 'underscore'
slug = require 'slug'

setPostLocals = (post, res) ->
	res.locals.title = post.title
	res.locals.description = post.preview
	res.locals.img = post.coverImg
	res.locals.url = 'http://theviewfromhere.is/posts/' + post.slug
	res.locals.type = 'article'
	console.log(res.locals)



# Date Conversion helper methods
toReadableDate = (doc) ->
	doc.createdAt = moment.unix(doc.createdAt).format('MMM DD, YYYY')

toUnixDate = (doc) ->
	doc.createdAt = moment(doc.createdAt).format('X')
	
toJSDate = (doc) ->
	doc.createdAt = moment.unix(doc.createdAt).toDate()

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
		q = {deleted : false}
		# Page Skipper
		pageSkip = 0
		postLimit = +req.query.all or 10
		if req.query.page
			pageSkip = (req.query.page - 1) * 10
		if req.query.deleted
			delete q.deleted
		
		# Create tag finder query
		if req.query.tag
			Tag.findOne {name : req.query.tag}, (err, tag) ->
				
				if tag
					q.tags = {$elemMatch : {$eq : tag._id} }					
					Post.find(q).sort('-createdAt').limit(postLimit).skip(pageSkip).populate('tags comments').exec (err, posts) ->
						if posts?
							for post in posts
								if post
									toReadableDate(post)
									
						res.send posts or []
				else
					res.send []
				
		else
			
			if req.params.id				
				Post.findOne({_id : req.params.id, deleted : false}).populate('tags').populate({
						path : 'comments'
						populate : {
							path : 'subComments'
							model : 'Comment'
						}
					}).exec (err, post) ->
						if post
							toReadableDate(post)						
							return res.send post
						else
							Post.findOne({slug : req.params.id, deleted : false}).populate('tags').populate({
								path : 'comments'
								populate : {
									path : 'subComments'
									model : 'Comment'
								}
							}).exec (err, post) ->
								if post
									toReadableDate(post)						
									return res.send post
								else
									res.send {title : 'No Post'}

			else
				console.log q
				Post.find(q).sort('-createdAt').limit(postLimit).skip(pageSkip).populate('tags comments').exec (err, posts) ->
					console.log(err, posts)
					if posts?
						for post in posts
							if post
								toReadableDate(post)
					res.send posts or []
		
		# super(req, res)

	getTags : (req, res) ->
		Tag.find {}, (err, tags) ->
			res.send tags
	random : (req, res) ->
		
		Post
			.count()
			.exec (err, count) ->
				# random = Math.floor(Math.random() * count) - 5
				Post
					.find()
					.exec (err, posts) ->
						shufflePosts = _.shuffle(posts)
						res.send shufflePosts.slice(0,5)
		
		
	getDeleted : (req, res) ->
		Post.find({deleted : true}).sort('-createdAt').exec (err, posts) ->
			res.send(posts)

	createPost : (req, res) ->
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
			
			body.createdAt = moment.unix(body.createdAt / 1000).format('X')
			# slugify the title
			if body.title?
				body.slug = slug(body.title.toLowerCase())

			newPost = new Post(body)
			newPost.save (err, doc) ->
				console.log err, doc
				if err
					res.send err
				else
					res.send doc
			
			# super(body, req, res)
	updatePost : (req, res) ->
		body = req.body
			
		body.tags = body.tags.map (tag) ->
			if tag.name?
				return tag.name
			else
				return tag.toLowerCase()
				
		createTagList body.tags, (tagList) ->
			body.tags = tagList
			if body.title?
				body.slug = slug(body.title.toLowerCase())
			
			body.createdAt = moment.unix(body.createdAt / 1000).format('X')
			Post.update {_id : req.params.id}, body, (err, post) ->
				
				Post.findOne {_id : req.params.id}, (err, post) ->
					res.send post
	delete : (req, res) ->
		super(req, res)

	getPage : (req, res) ->
		Post.findOne({_id : req.params.id, deleted : false}).populate('tags').populate({
				path : 'comments'
				populate : {
					path : 'subComments'
					model : 'Comment'
				}
			}).exec (err, post) ->
				if post
					toReadableDate(post)
					setPostLocals(post, res);						
					return res.render 'post', {post:post}
				else
					Post.findOne({slug : req.params.id, deleted : false}).populate('tags').populate({
						path : 'comments'
						populate : {
							path : 'subComments'
							model : 'Comment'
						}
					}).exec (err, post) ->
						if post
							toReadableDate(post)
							setPostLocals(post, res);						
							return res.render 'post', {post :post}
						else
							res.render 'post', {post : {title : 'No Post'}}




module.exports = new Posts()
