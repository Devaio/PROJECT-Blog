moment = require 'moment'
# Routes
multipart = require('connect-multiparty')
request = require('request')

middleware = {

	authorize : (req, res, next) ->
		if not req.isAuthenticated()
			return res.redirect '/'
		else
			next()

	setLocals : (req, res, next) ->
		timeStamp = moment().format('X')
		#Always pass user object and environment variable to views		
		res.locals.user = req.user
		res.locals.ENV = if global.process.env.NODE_ENV is 'live' then global.process.env.NODE_ENV else undefined
		res.locals.timeStamp = timeStamp
		res.locals.title = ''
		res.locals.description = ''
		res.locals.img = 'http://theviewfromhere.is/public/img/logo-fb.png'
		res.locals.url = ''
		res.locals.type = ''
		res.locals.requrl = "http://" + req.host + '/' + req.originalUrl
		next()
	
	multi : multipart()
	nocache : (req, res, next) ->
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
		res.header('Expires', '-1')
		res.header('Pragma', 'no-cache')
		next()
}

module.exports = (app, passport, redis) ->
	# Controllers
	accounts = require '../controllers/accounts'
	posts = require '../controllers/posts'
	tags = require '../controllers/tags'
	media = require '../controllers/media'
	comments = require '../controllers/comments'
	
	
	
	
	auth = require '../controllers/auth'
	# app.use(middleware.nocache)

	app.get '/posts/:id', middleware.setLocals, posts.getPage

	# API Routes
	app.get '/api/me', (req, res) ->
		res.send {user : req.user}
		
	app.get '/api/posts', posts.get
	app.get '/api/posts/random', posts.random
	app.get '/api/posts/:id', posts.get
	app.post '/api/posts', middleware.authorize, posts.createPost
	app.post '/api/posts/:id', middleware.authorize, posts.updatePost
	app.get '/api/posts/delete/:id', middleware.authorize, posts.delete
	
	app.delete '/api/posts/:id', middleware.authorize, posts.delete
	
	
	app.get '/api/tags', tags.get
	app.get '/api/tags/:id', tags.get
	
	app.post '/api/media', middleware.multi, media.uploadFiles

	# Comment
	app.get '/api/comments', middleware.authorize, comments.get
	app.post '/api/comments/create/:postID', comments.createComment	
	app.post '/api/comments/:id', comments.updateComment
	app.delete '/api/comments/:id', middleware.authorize, comments.delete
	
	
	# Login
	app.post '/admin/login', auth.login

	# Subscribe
	app.post '/api/subscribe', (req, res) ->
		request {
			url : 'https://api.sendgrid.com/v3/contactdb/recipients',
			method : "POST",
			headers : {
				"Authorization" : "Bearer " + process.env.SENDGRID_KEY
			},
			json : true,
			body : [
				{
					email : req.body.email
				}
			]
		}, (err, resp, body) ->
			console.log err, body
			res.send(body)

	


	sitemapper = require('express-sitemap')
	sitemap = sitemapper().generate4(app)

	console.log(sitemapper)

	sitemapper({map : sitemap}).toFile()

	# Wildcard route
	app.get('/*', middleware.setLocals, (req, res) ->
		res.render 'index'
	)