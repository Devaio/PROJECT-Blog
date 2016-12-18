var middleware, moment, multipart, request;

moment = require('moment');

multipart = require('connect-multiparty');

request = require('request');

middleware = {
  authorize: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    } else {
      return next();
    }
  },
  setLocals: function(req, res, next) {
    var timeStamp;
    timeStamp = moment().format('X');
    res.locals.user = req.user;
    res.locals.ENV = global.process.env.NODE_ENV === 'live' ? global.process.env.NODE_ENV : void 0;
    res.locals.timeStamp = timeStamp;
    res.locals.title = '';
    res.locals.description = '';
    res.locals.img = 'http://theviewfromhere.is/public/img/logo-fb.png';
    res.locals.url = '';
    res.locals.type = '';
    return next();
  },
  multi: multipart(),
  nocache: function(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    return next();
  }
};

module.exports = function(app, passport, redis) {
  var accounts, auth, comments, media, posts, tags;
  accounts = require('../controllers/accounts');
  posts = require('../controllers/posts');
  tags = require('../controllers/tags');
  media = require('../controllers/media');
  comments = require('../controllers/comments');
  auth = require('../controllers/auth');
  app.get('/posts/:id', middleware.setLocals, posts.getPage);
  app.get('/api/me', function(req, res) {
    return res.send({
      user: req.user
    });
  });
  app.get('/api/posts', posts.get);
  app.get('/api/posts/random', posts.random);
  app.get('/api/posts/:id', posts.get);
  app.post('/api/posts', middleware.authorize, posts.createPost);
  app.post('/api/posts/:id', middleware.authorize, posts.updatePost);
  app.get('/api/posts/delete/:id', middleware.authorize, posts["delete"]);
  app["delete"]('/api/posts/:id', middleware.authorize, posts["delete"]);
  app.get('/api/tags', tags.get);
  app.get('/api/tags/:id', tags.get);
  app.post('/api/media', middleware.multi, media.uploadFiles);
  app.get('/api/comments', middleware.authorize, comments.get);
  app.post('/api/comments/create/:postID', comments.createComment);
  app.post('/api/comments/:id', comments.updateComment);
  app["delete"]('/api/comments/:id', middleware.authorize, comments["delete"]);
  app.post('/admin/login', auth.login);
  app.post('/api/subscribe', function(req, res) {
    return request({
      url: 'https://api.sendgrid.com/v3/contactdb/recipients',
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.SENDGRID_KEY
      },
      json: true,
      body: [
        {
          email: req.body.email
        }
      ]
    }, function(err, resp, body) {
      console.log(err, body);
      return res.send(body);
    });
  });
  return app.get('/*', middleware.setLocals, function(req, res) {
    return res.render('index');
  });
};
