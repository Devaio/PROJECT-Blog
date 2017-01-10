var app, bodyParser, cookieParser, env, express, fs, models, mongoose, multiMiddle, multipart, passport, port, session;

fs = require('fs');

env = require('node-env-file');

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

app.use('/public', express["static"](__dirname + '/../public', {
  maxAge: 86400000
}));

app.use('/.well-known', express["static"](__dirname + '/../public', {
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

port = process.env.PORT || 3000;

app.listen(port, function() {
  return console.log("Server running on port " + port);
});
