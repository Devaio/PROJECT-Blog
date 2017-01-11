var HTTP, HTTPS, app, bodyParser, certificate, chain, cookieParser, e, env, express, fs, httpsConfig, key, models, mongoose, multiMiddle, multipart, passport, ports, session;

fs = require('fs');

env = require('node-env-file');

HTTP = require('http');

HTTPS = require('https');

if (fs.existsSync("/etc/letsencrypt/live/theviewfromhere.is/cert.pem")) {
  certificate = fs.readFileSync("/etc/letsencrypt/live/theviewfromhere.is/cert.pem");
  chain = fs.readFileSync("/etc/letsencrypt/live/theviewfromhere.is/chain.pem");
  key = fs.readFileSync("/etc/letsencrypt/live/theviewfromhere.is/privkey.pem");
  httpsConfig = {
    cert: certificate + chain,
    key: key
  };
}

if (typeof global.process.env.NODE_ENV === 'undefined') {
  if (fs.existsSync(__dirname + '/../env/development.env')) {
    env(__dirname + '/../env/development.env');
  }
}

console.log = (global.process.env.NODE_ENV != null) && global.process.env.NODE_ENV === 'live' ? function() {} : console.log;

express = require('express');

bodyParser = require('body-parser');

mongoose = require('mongoose');

session = require('express-session');

cookieParser = require('cookie-parser');

passport = require('passport');

multipart = require('connect-multiparty');

multiMiddle = multipart();

mongoose.connect(global.process.env.DB_URI + '?slaveOk=true&connectTimeoutMS=10000', function(err) {
  return console.log(err);
});

models = __dirname + '/models';

fs.readdirSync(models).forEach(function(file) {
  return require(models + '/' + file);
});

app = express();

app.set('view engine', 'jade');

app.set('views', __dirname + '/../views');

app.all('*', function(req, res, next) {
  if (req.protocol === 'http') {
    res.set('X-Forwarded-Proto', 'https');
    res.redirect('https://' + req.headers.host + req.url);
  } else {
    next();
  }
});

app.use('/public', express["static"](__dirname + '/../public', {
  maxAge: 86400000
}));

app.use('/.well-known', express["static"](__dirname + '/../public/.well-known', {
  maxAge: 86400000
}));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use(cookieParser());

app.use(session({
  secret: global.process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());

app.use(passport.session());

require('./config/passport')(passport);

require('./config/routes')(app, passport);

ports = {
  http: process.env.PORT || 3000,
  https: process.env.PORT_SSL || 443
};

HTTP.createServer(app).listen(ports.http, function() {
  return console.log("Server running on " + ports.http);
});

try {
  HTTPS.createServer(httpsConfig, app).listen(ports.https);
} catch (_error) {
  e = _error;
  console.error('Could not HTTPS server', e);
}
