fs = require 'fs'
env = require 'node-env-file'
needHttps = false;
if fs.existsSync("/etc/letsencrypt/live/theviewfromhere.is/cert.pem")
  needHttps = true;
  certificate = fs.readFileSync("/etc/letsencrypt/live/theviewfromhere.is/cert.pem")
  chain = fs.readFileSync("/etc/letsencrypt/live/theviewfromhere.is/chain.pem")
  key= fs.readFileSync("/etc/letsencrypt/live/theviewfromhere.is/privkey.pem")

  httpsConfig = {
    cert: certificate + chain,
    key: key
  };

# Read evironment vars from file if no environment exists
# Load ENV vars
if typeof(global.process.env.NODE_ENV) is 'undefined'
	if fs.existsSync(__dirname + '/../env/development.env')
		env(__dirname + '/../env/development.env')


# Disable logs
console.log = if global.process.env.NODE_ENV? and global.process.env.NODE_ENV is 'live' then () -> else console.log

express = require('express')
bodyParser = require('body-parser')
mongoose = require('mongoose')
session = require('express-session')
cookieParser = require('cookie-parser')
passport = require('passport')
multipart = require('connect-multiparty')
multiMiddle = multipart()
# Connect to the database and read model files
mongoose.connect(global.process.env.DB_URI+'?slaveOk=true&connectTimeoutMS=10000', (err) ->
  console.log(err)
)
models = __dirname + '/models'
fs.readdirSync(models).forEach (file) ->
  require(models + '/' + file)


app = express()
app.set 'view engine', 'jade'
app.set('views', __dirname + '/../views')

app.use('/public', express.static(__dirname + '/../public', {maxAge : 86400000}))
app.use('/.well-known', express.static(__dirname + '/../public/.well-known', {maxAge : 86400000}))

# Prerender.io
# app.use(require('prerender-node').set('prerenderToken', 'HvuxVE0VSpnkqjIBIn0p'));

app.use bodyParser.urlencoded(extended: false)
app.use bodyParser.json()
app.use cookieParser()

app.use session(
  secret: global.process.env.SESSION_SECRET
  resave: false
  saveUninitialized: true
)

# Hook in passport to the middleware chain
app.use passport.initialize()

# Hook in the passport session management into the middleware chain.
app.use passport.session()

# Passport
require('./config/passport')(passport)
# Routes
require('./config/routes')(app, passport)

port = process.env.PORT or 3000
# app.listen port, () -> 
#   console.log "Server running on port " + port


if(needHttps)
  https.createServer(httpsConfig, app)
      .listen port, (err) -> 
        if (err)
          console.log("https server listen error with error ", err)
          return process.exit(1)
        

        console.info("Successfully setup HTTPS server listening at" + port)

else
  app.listen port, () -> 
    console.log "Server running on port " + port





