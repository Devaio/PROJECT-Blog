var Schema, comments, moment, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

moment = require('moment');

comments = new Schema({
  name: String,
  email: String,
  website: String,
  content: String,
  approved: {
    type: Boolean,
    "default": false
  },
  createdAt: String,
  deleted: {
    type: Boolean,
    "default": false
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  },
  isSubComment: {
    type: Boolean,
    "default": false
  },
  subComments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment'
    }
  ],
  sendEmail: {
    type: Boolean,
    "default": false
  }
});

comments.path('createdAt')["default"](function() {
  return moment().format('X');
});

mongoose.model('Comment', comments);