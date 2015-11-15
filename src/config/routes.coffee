
# Routes

middleware = {

	authorize : (req, res, next) ->
		if not req.isAuthenticated()
			return res.redirect '/'
		else
			next()

	setLocals : (req, res, next) ->
		#Always pass user object and environment variable to views
		res.locals.user = req.user
		res.locals.ENV = global.process.env.NODE_ENV
		next()
			
}

module.exports = (app, passport, redis) ->
	# Controllers
	accounts = require '../controllers/accounts'
	posts = require '../controllers/posts'
	tags = require '../controllers/tags'
	
	
	auth = require '../controllers/auth'
	

	# API Routes
	app.get '/api/me', (req, res) ->
		console.log 'API ME'
		console.log 'REQ USER', req.user
		res.send {user : req.user}
		
	app.get '/api/posts', posts.get
	app.get '/api/posts/:id', posts.get
	app.post '/api/posts', middleware.authorize, posts.createPost
	app.post '/api/posts/:id', middleware.authorize, posts.updatePost
	app.get '/api/posts/delete/:id', middleware.authorize, posts.delete
	
	app.delete '/api/posts/:id', middleware.authorize, posts.delete
	
	app.get '/api/tags', tags.get
	app.get '/api/tags/:id', tags.get
	

	# Login
	app.post '/admin/login', auth.login

	# Wildcard route
	app.get('/*', (req, res) ->
		res.render 'index'
	)


