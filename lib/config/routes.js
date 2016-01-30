var middleware, moment, multipart;

moment = require('moment');

multipart = require('connect-multiparty');

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
    return next();
  },
  multi: multipart()
};

module.exports = function(app, passport, redis) {
  var accounts, auth, media, posts, tags;
  accounts = require('../controllers/accounts');
  posts = require('../controllers/posts');
  tags = require('../controllers/tags');
  media = require('../controllers/media');
  auth = require('../controllers/auth');
  app.get('/api/me', function(req, res) {
    console.log('API ME');
    console.log('REQ USER', req.user);
    return res.send({
      user: req.user
    });
  });
  app.get('/api/posts', posts.get);
  app.get('/api/posts/:id', posts.get);
  app.post('/api/posts', middleware.authorize, posts.createPost);
  app.post('/api/posts/:id', middleware.authorize, posts.updatePost);
  app.get('/api/posts/delete/:id', middleware.authorize, posts["delete"]);
  app["delete"]('/api/posts/:id', middleware.authorize, posts["delete"]);
  app.get('/api/tags', tags.get);
  app.get('/api/tags/:id', tags.get);
  app.post('/api/media', middleware.multi, media.uploadFiles);
  app.post('/admin/login', auth.login);
  return app.get('/*', middleware.setLocals, function(req, res) {
    return res.render('index');
  });
};
