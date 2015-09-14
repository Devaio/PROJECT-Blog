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
  var accounts, auth;
  accounts = require('../controllers/accounts');
  auth = require('../controllers/auth');
  app.get('/api/me', function(req, res) {
    console.log('API ME');
    console.log('REQ USER', req.user);
    return res.send({
      user: req.user
    });
  });
  app.post('/admin/login', auth.login);
  return app.get('/*', function(req, res) {
    return res.render('index');
  });
};
