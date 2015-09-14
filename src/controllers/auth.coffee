#Auth controller
passport = require('passport')

performLogin = (req, res, next, user) ->
	req.login user, (err) ->
		if err
			return next(err)
		# Otherwise, send the user
		setTimeout () ->
			res.send {user : user}
		, 5000
	return



module.exports.login = (req, res, next) ->
	authFunction = passport.authenticate('local', (err, user, info) ->
		# If there was an error, allow execution to move to the next middleware
		if err
			return next(err)
		if !user
			return res.send({error : 'No user!'})
		performLogin req, res, next, user
		return
	)
	# Now that we have the authentication method created, we'll call it here.
	authFunction req, res, next







# module.exports.logout = (req, res) ->
# 	req.logout()
# 	res.redirect '/'

# module.exports.auth = (req, res) ->
# 	res.redirect '/'



	

	
