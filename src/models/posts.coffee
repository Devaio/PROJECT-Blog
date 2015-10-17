# Post Model

mongoose = require 'mongoose'
Schema = mongoose.Schema
passwords = require '../modules/passwords'
moment = require 'moment'

# Post Collection
posts = new Schema
	title : String,
	content : String
	tags : [{type : Schema.ObjectId, ref : "Tag"}]
	createdAt : String
	deleted : {type : Boolean, default : false}
	

posts.path('createdAt').default () ->
	return moment().format('X')

mongoose.model 'Post', posts