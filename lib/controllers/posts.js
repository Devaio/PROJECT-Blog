var Main, Post, Posts, Tag, async, createTagList, moment, mongoose, setPostLocals, slug, toJSDate, toReadableDate, toUnixDate, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mongoose = require('mongoose');

async = require('async');

Post = mongoose.model('Post');

Tag = mongoose.model('Tag');

Main = require('./main');

moment = require('moment');

_ = require('underscore');

slug = require('slug');

setPostLocals = function(post, res) {
  res.locals.title = post.title;
  res.locals.description = post.preview;
  res.locals.img = post.coverImg;
  res.locals.url = 'http://theviewfromhere.is/posts/' + post.slug;
  res.locals.type = 'article';
  return console.log(res.locals);
};

toReadableDate = function(doc) {
  return doc.createdAt = moment.unix(doc.createdAt).format('MMM DD, YYYY');
};

toUnixDate = function(doc) {
  return doc.createdAt = moment(doc.createdAt).format('X');
};

toJSDate = function(doc) {
  return doc.createdAt = moment.unix(doc.createdAt).toDate();
};

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
    var pageSkip, postLimit, q;
    q = {
      deleted: false
    };
    pageSkip = 0;
    postLimit = +req.query.all || 10;
    if (req.query.page) {
      pageSkip = (req.query.page - 1) * 10;
    }
    if (req.query.deleted) {
      delete q.deleted;
    }
    if (req.query.tag) {
      return Tag.findOne({
        name: req.query.tag
      }, function(err, tag) {
        if (tag) {
          q.tags = {
            $elemMatch: {
              $eq: tag._id
            }
          };
          return Post.find(q).sort('-createdAt').limit(postLimit).skip(pageSkip).populate('tags comments').exec(function(err, posts) {
            var post, _i, _len;
            if (posts != null) {
              for (_i = 0, _len = posts.length; _i < _len; _i++) {
                post = posts[_i];
                if (post) {
                  toReadableDate(post);
                }
              }
            }
            return res.send(posts || []);
          });
        } else {
          return res.send([]);
        }
      });
    } else {
      if (req.params.id) {
        return Post.findOne({
          _id: req.params.id,
          deleted: false
        }).populate('tags').populate({
          path: 'comments',
          populate: {
            path: 'subComments',
            model: 'Comment'
          }
        }).exec(function(err, post) {
          if (post) {
            toReadableDate(post);
            return res.send(post);
          } else {
            return Post.findOne({
              slug: req.params.id,
              deleted: false
            }).populate('tags').populate({
              path: 'comments',
              populate: {
                path: 'subComments',
                model: 'Comment'
              }
            }).exec(function(err, post) {
              if (post) {
                toReadableDate(post);
                return res.send(post);
              } else {
                return res.send({
                  title: 'No Post'
                });
              }
            });
          }
        });
      } else {
        console.log(q);
        return Post.find(q).sort('-createdAt').limit(postLimit).skip(pageSkip).populate('tags comments').exec(function(err, posts) {
          var post, _i, _len;
          console.log(err, posts);
          if (posts != null) {
            for (_i = 0, _len = posts.length; _i < _len; _i++) {
              post = posts[_i];
              if (post) {
                toReadableDate(post);
              }
            }
          }
          return res.send(posts || []);
        });
      }
    }
  };

  Posts.prototype.getTags = function(req, res) {
    return Tag.find({}, function(err, tags) {
      return res.send(tags);
    });
  };

  Posts.prototype.random = function(req, res) {
    return Post.count().exec(function(err, count) {
      return Post.find().exec(function(err, posts) {
        var shufflePosts;
        shufflePosts = _.shuffle(posts);
        return res.send(shufflePosts.slice(0, 5));
      });
    });
  };

  Posts.prototype.getDeleted = function(req, res) {
    return Post.find({
      deleted: true
    }).sort('-createdAt').exec(function(err, posts) {
      return res.send(posts);
    });
  };

  Posts.prototype.createPost = function(req, res) {
    var body;
    body = req.body;
    console.log('POST BODY', body);
    body.tags = body.tags.map(function(tag) {
      return tag.toLowerCase();
    });
    return createTagList(body.tags, function(tagList) {
      var newPost;
      body.tags = tagList;
      body.createdAt = moment.unix(body.createdAt / 1000).format('X');
      if (body.title != null) {
        body.slug = slug(body.title.toLowerCase());
      }
      newPost = new Post(body);
      return newPost.save(function(err, doc) {
        console.log(err, doc);
        if (err) {
          return res.send(err);
        } else {
          return res.send(doc);
        }
      });
    });
  };

  Posts.prototype.updatePost = function(req, res) {
    var body;
    body = req.body;
    body.tags = body.tags.map(function(tag) {
      if (tag.name != null) {
        return tag.name;
      } else {
        return tag.toLowerCase();
      }
    });
    return createTagList(body.tags, function(tagList) {
      body.tags = tagList;
      if (body.title != null) {
        body.slug = slug(body.title.toLowerCase());
      }
      body.createdAt = moment.unix(body.createdAt / 1000).format('X');
      return Post.update({
        _id: req.params.id
      }, body, function(err, post) {
        return Post.findOne({
          _id: req.params.id
        }, function(err, post) {
          return res.send(post);
        });
      });
    });
  };

  Posts.prototype["delete"] = function(req, res) {
    return Posts.__super__["delete"].call(this, req, res);
  };

  Posts.prototype.getPage = function(req, res) {
    return Post.findOne({
      _id: req.params.id,
      deleted: false
    }).populate('tags').populate({
      path: 'comments',
      populate: {
        path: 'subComments',
        model: 'Comment'
      }
    }).exec(function(err, post) {
      if (post) {
        toReadableDate(post);
        setPostLocals(post, res);
        return res.render('post', {
          post: post
        });
      } else {
        return Post.findOne({
          slug: req.params.id,
          deleted: false
        }).populate('tags').populate({
          path: 'comments',
          populate: {
            path: 'subComments',
            model: 'Comment'
          }
        }).exec(function(err, post) {
          if (post) {
            toReadableDate(post);
            setPostLocals(post, res);
            return res.render('post', {
              post: post
            });
          } else {
            return res.render('post', {
              post: {
                title: 'No Post'
              }
            });
          }
        });
      }
    });
  };

  return Posts;

})(Main);

module.exports = new Posts();
