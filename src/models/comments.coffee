# Comment Model

mongoose = require 'mongoose'
Schema = mongoose.Schema
moment = require 'moment'

# Comment Collection
comments = new Schema
	name : String
	email : String
	website : String
	content : String
	approved : {type : Boolean, default : false}
	createdAt : String
	deleted : {type : Boolean, default : false}
	post : {type : mongoose.Schema.ObjectId, ref : 'Post'}
	

comments.path('createdAt').default () ->
	return moment().format('X')

mongoose.model 'Comment', comments