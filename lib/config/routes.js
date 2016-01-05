var middleware;

middleware = {
  authorize: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    } else {
      return next();
    }
  },
  setLocals: function(req, res, next) {
    res.locals.user = req.user;
    res.locals.ENV = global.process.env.NODE_ENV;
    return next();
  }
};

module.exports = function(app, passport, redis) {
  var accounts, auth, posts, tags;
  accounts = require('../controllers/accounts');
  posts = require('../controllers/posts');
  tags = require('../controllers/tags');
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
  app.post('/api/media', function(req, res) {
    console.log('Uploading...');
    console.log(req.files);
    console.log('----');
    return console.log(req.body);
  });
  app.post('/admin/login', auth.login);
  return app.get('/*', function(req, res) {
    return res.render('index');
  });
};
