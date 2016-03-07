var Comment, Comments, Main, Post, async, moment, mongoose, toJSDate, toReadableDate, toUnixDate,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mongoose = require('mongoose');

async = require('async');

Post = mongoose.model('Post');

Comment = mongoose.model('Comment');

Main = require('./main');

moment = require('moment');

toReadableDate = function(doc) {
  return doc.createdAt = moment.unix(doc.createdAt).format('MMM DD, YYYY');
};

toUnixDate = function(doc) {
  return doc.createdAt = moment(doc.createdAt).format('X');
};

toJSDate = function(doc) {
  return doc.createdAt = moment.unix(doc.createdAt).toDate();
};

Comments = (function(_super) {
  __extends(Comments, _super);

  function Comments() {
    Comments.__super__.constructor.call(this, Comment);
  }

  Comments.prototype.get = function(req, res) {
    return Comments.__super__.get.call(this, req, res);
  };

  Comments.prototype.createComment = function(req, res) {
    var body, newComment, self;
    self = this;
    body = req.body;
    console.log('Comment BODY', body);
    newComment = new Comment(body);
    return newComment.save(function(err, doc) {
      console.log(err, doc);
      if (err) {
        return res.send(err);
      } else {
        return res.send(doc);
      }
    });
  };

  Comments.prototype["delete"] = function(req, res) {
    return Comments.__super__["delete"].call(this, req, res);
  };

  return Comments;

})(Main);

module.exports = new Comments();
