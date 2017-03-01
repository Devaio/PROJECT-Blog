var Post, env, fs, mongoose, slug;

mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/clarissablog?slaveOk=true&connectTimeoutMS=10000');

fs = require('fs');

env = require('node-env-file');

slug = require('slug');

if (typeof global.process.env.NODE_ENV === 'undefined') {
  if (fs.existsSync(__dirname + '/../../env/development.env')) {
    env(__dirname + '/../../env/development.env');
  }
}

require('../models/posts');

Post = mongoose.model('Post');

Post.find({}).limit(500).exec(function(err, posts) {
  var post, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = posts.length; _i < _len; _i++) {
    post = posts[_i];
    post['coverImg'] = post['coverImg'].replace('http://theviewfromhere.s3.amazonaws.com/', '/public/img/');
    post['pinImg'] = post['pinImg'].replace('http://theviewfromhere.s3.amazonaws.com/', '/public/img/');
    post['content'] = post['content'].replace('http://theviewfromhere.s3.amazonaws.com/', '/public/img/');
    post.markModified('coverImg');
    post.markModified('pinImg');
    post.markModified('content');
    _results.push(post.save(function(err, doc) {
      return console.log(err, doc);
    }));
  }
  return _results;
});
