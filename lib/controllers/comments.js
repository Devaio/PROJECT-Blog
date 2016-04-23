var Comment, Comments, Main, Post, async, moment, mongoose, toJSDate, toReadableDate, toUnixDate, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mongoose = require('mongoose');

async = require('async');

Post = mongoose.model('Post');

Comment = mongoose.model('Comment');

_ = require('lodash');

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
    return Comment.find({
      approved: false
    }).sort('post').populate('post').exec(function(err, docs) {
      var groupedComments;
      console.log(err, docs);
      groupedComments = _.groupBy(docs, function(doc) {
        return doc.post.title;
      });
      return res.send(groupedComments);
    });
  };

  Comments.prototype.createComment = function(req, res) {
    var body, newComment, self;
    self = this;
    body = req.body;
    console.log('Comment BODY', body);
    body.post = req.params.postID;
    newComment = new Comment(body);
    return newComment.save(function(err, doc) {
      console.log(err, doc);
      if (err) {
        return res.send(err);
      } else {
        if (doc.isSubComment) {
          return res.send(doc);
        } else {
          return Post.findOne({
            _id: req.params.postID
          }, function(err, foundPost) {
            foundPost.comments = foundPost.comments || [];
            foundPost.comments.push(doc._id);
            foundPost.save();
            return res.send(doc);
          });
        }
      }
    });
  };

  Comments.prototype.updateComment = function(req, res) {
    return Comment.update({
      _id: req.params.id
    }, req.body, function(err, doc) {
      return res.send(doc);
    });
  };

  Comments.prototype["delete"] = function(req, res) {
    return Comment.remove({
      _id: req.params.id
    }, function(err, rmv) {
      return res.send(rmv);
    });
  };

  return Comments;

})(Main);

module.exports = new Comments();