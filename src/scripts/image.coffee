mongoose = require 'mongoose'
mongoose.connect('mongodb://localhost/clarissablog?slaveOk=true&connectTimeoutMS=10000')
 
fs = require 'fs'
env = require 'node-env-file'
slug = require 'slug'
# Read evironment vars from file if no environment exists
# Load ENV vars
if typeof(global.process.env.NODE_ENV) is 'undefined'
	if fs.existsSync(__dirname + '/../../env/development.env')
		env(__dirname + '/../../env/development.env')

 
require '../models/posts'
Post = mongoose.model('Post')

Post.find({}).limit(500).exec (err, posts) ->
    for post in posts
        
        if post.coverImg?
            post['coverImg'] = post['coverImg'].replace('http://theviewfromhere.s3.amazonaws.com/', '/public/img/')
        if post.pinImg
            post['pinImg'] = post['pinImg'].replace('http://theviewfromhere.s3.amazonaws.com/', '/public/img/')
        if post.content
            post['content'] = post['content'].replace('http://theviewfromhere.s3.amazonaws.com/', '/public/img/')
        
        post.markModified('coverImg')
        post.markModified('pinImg')
        post.markModified('content')
        post.save((err, doc) ->
            console.log err, doc
        )
        
        
            



            # http://theviewfromhere.s3.amazonaws.com/ => /public/img