var Schema, moment, mongoose, passwords, posts;

mongoose = require('mongoose');

Schema = mongoose.Schema;

passwords = require('../modules/passwords');

moment = require('moment');

posts = new Schema({
  title: String,
  content: String,
  tags: {
    type: Array,
    "default": []
  },
  createdAt: String
});

posts.path('createdAt')["default"](function() {
  return moment().format('X');
});

mongoose.model('Post', posts);
