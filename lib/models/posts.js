var Schema, moment, mongoose, passwords, posts;

mongoose = require('mongoose');

Schema = mongoose.Schema;

passwords = require('../modules/passwords');

moment = require('moment');

posts = new Schema({
  title: String,
  coverImg: String,
  pinImg: String,
  preview: String,
  content: String,
  tags: [
    {
      type: Schema.ObjectId,
      ref: "Tag"
    }
  ],
  createdAt: String,
  deleted: {
    type: Boolean,
    "default": false
  }
});

posts.path('createdAt')["default"](function() {
  return moment().format('X');
});

mongoose.model('Post', posts);
