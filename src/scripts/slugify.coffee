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
        post.slug = slug(post.title.toLowerCase())
        post.markModified('slug')
        post.save (err, post) ->
            console.log(err)
            