# Post Model

mongoose = require 'mongoose'
Schema = mongoose.Schema
passwords = require '../modules/passwords'
moment = require 'moment'

# Post Collection
posts = new Schema
	title : String,
	content : String
	tags : {type : Array, default : []}
	# DO TAGS NEED TO BE SEPARATE MODEL??
	createdAt : String
	
# posts.pre 'save', (next) ->
# 	# First, check to see if the password has been modified. If not, just move on.
# 	if !@isModified('password')
# 		return next()
# 	# Store access to "this", which represents the current user document
# 	user = this
# 	user.password = passwords.encrypt user.password
# 	next()
# 	return
posts.path('createdAt').default () ->
	return moment().format('X')

mongoose.model 'Post', posts