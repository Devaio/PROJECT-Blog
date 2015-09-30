var middleware;

middleware = {
  authorize: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
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
  var accounts, auth, posts;
  accounts = require('../controllers/accounts');
  posts = require('../controllers/posts');
  auth = require('../controllers/auth');
  app.get('/api/me', function(req, res) {
    console.log('API ME');
    console.log('REQ USER', req.user);
    return res.send({
      user: req.user
    });
  });
  app.get('/api/posts', posts.get);
  app.post('/api/posts', posts.createPost);
  app.post('/api/posts/:id', posts.updatePost);
  app["delete"]('/api/posts/:id', posts["delete"]);
  app.get('/api/tags', posts.getTags);
  app.post('/admin/login', auth.login);
  return app.get('/*', function(req, res) {
    return res.render('index');
  });
};
