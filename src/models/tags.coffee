# Tag Model

mongoose = require 'mongoose'
Schema = mongoose.Schema

# Post Collection
tags = new Schema
	name : String

mongoose.model 'Tag', tags