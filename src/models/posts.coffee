# Post Model

mongoose = require 'mongoose'
Schema = mongoose.Schema
passwords = require '../modules/passwords'
moment = require 'moment'

# Post Collection
posts = new Schema
	title : String
	coverImg : String
	pinImg : String
	preview : String
	content : String
	tags : [{type : Schema.ObjectId, ref : "Tag"}]
	createdAt : String
	deleted : {type : Boolean, default : false}
	comments : [{type : Schema.ObjectId, ref : "Comment"}]
	

posts.path('createdAt').default () ->
	return moment().format('X')

mongoose.model 'Post', posts