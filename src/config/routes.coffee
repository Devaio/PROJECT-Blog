
# Routes

middleware = {

	authorize : (req, res, next) ->
		if not req.isAuthenticated()
			return res.redirect '/login'
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
	
	auth = require '../controllers/auth'
	

	# API Routes
	app.get '/api/me', (req, res) ->
		console.log 'API ME'
		console.log 'REQ USER', req.user
		res.send {user : req.user}
		
	app.get '/api/posts', posts.get
	app.post '/api/posts', posts.upsert
	app.delete '/api/posts/:id', posts.delete
	

	# Login
	app.post '/admin/login', auth.login

	# Wildcard route
	app.get('/*', (req, res) ->
		res.render 'index'
	)


