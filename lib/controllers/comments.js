var Comment, Comments, Mailer, Main, Post, async, fs, moment, mongoose, toJSDate, toReadableDate, toUnixDate, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mongoose = require('mongoose');

async = require('async');

Post = mongoose.model('Post');

Comment = mongoose.model('Comment');

_ = require('lodash');

Main = require('./main');

moment = require('moment');

fs = require('fs');

Mailer = require('../modules/mailer');

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
      var commentText;
      console.log(err, doc);
      if (err) {
        res.send(err);
        commentText = fs.readFileSync(__dirname + '../../comments.txt', 'utf-8');
        return fs.writeFileSync(__dirname + '../../comments.txt', commentText + '\n ' + JSON.stringify(body));
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
    });
  };

  Comments.prototype.updateComment = function(req, res) {
    var body;
    body = req.body;
    return Comment.findOneAndUpdate({
      _id: req.params.id
    }, body, {
      "new": true
    }, function(err, doc) {
      res.send(doc);
      if (doc.isSubComment) {
        console.log(doc._id);
        return Comment.findOne({
          subComments: doc._id
        }, function(err, parentComment) {
          console.log(err, parentComment);
          if ((parentComment != null) && parentComment.sendEmail === true && (parentComment.email != null)) {
            return Mailer.send('651f0a1f-81a9-49ab-9b78-9e801d23c914', [
              {
                name: '%name%',
                content: "<h2>" + doc.name + "</h2>"
              }, {
                name: '%comment%',
                content: "<h4>" + doc.content + "</h4>"
              }
            ], {
              to: parentComment.email,
              from: 'services@theviewfromhere.is'
            }, function(err, response) {
              if (err) {
                return console.log('BAD EMAIL', err);
              } else {
                return console.log('GOOD EMAIL', response);
              }
            });
          }
        });
      }
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
