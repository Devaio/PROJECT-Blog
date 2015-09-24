var Main, Post, Posts, Tag, async, createTagList, mongoose,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mongoose = require('mongoose');

async = require('async');

Post = mongoose.model('Post');

Tag = mongoose.model('Tag');

Main = require('./main');

createTagList = function(newPostTags, cb) {
  var tagList, tasks;
  tasks = [];
  tagList = [];
  return Tag.find({
    name: {
      $in: newPostTags
    }
  }, function(err, tags) {
    var createdTagNames, tag, _fn, _i, _len;
    createdTagNames = tags.map(function(tag) {
      return tag.name;
    });
    _fn = function(tag) {
      return tasks.push(function(cb) {
        var createTag, tagIndex;
        tagIndex = createdTagNames.indexOf(tag);
        if (tagIndex === -1) {
          console.log('TASK');
          createTag = new Tag({
            name: tag
          });
          return createTag.save(function(err, doc) {
            tagList.push(doc._id);
            return cb();
          });
        } else {
          tagList.push(tags[tagIndex]._id);
          return cb();
        }
      });
    };
    for (_i = 0, _len = newPostTags.length; _i < _len; _i++) {
      tag = newPostTags[_i];
      _fn(tag);
    }
    return async.series(tasks, function() {
      console.log('NT', tagList);
      return cb(tagList);
    });
  });
};

Posts = (function(_super) {
  __extends(Posts, _super);

  function Posts() {
    Posts.__super__.constructor.call(this, Post);
  }

  Posts.prototype.get = function(req, res) {
    return Posts.__super__.get.call(this, req, res);
  };

  Posts.prototype["delete"] = function(req, res) {
    return Posts.__super__["delete"].call(this, req, res);
  };

  Posts.prototype.upsert = function(req, res) {
    var body, self;
    self = this;
    body = req.body;
    console.log('POST BODY', body);
    body.tags = body.tags.map(function(tag) {
      return tag.toLowerCase();
    });
    return createTagList(body.tags, function(tagList) {
      body.tags = tagList;
      return Posts.__super__.upsert.call(this, body, req, res);
    });
  };

  return Posts;

})(Main);

module.exports = new Posts();
