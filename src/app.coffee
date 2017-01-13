fs = require 'fs'
env = require 'node-env-file'

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

app.get '/robots.txt', (req, res) ->
  res.sendFile('robots.txt', {root : './public'})

app.get '/sitemap.xml', (req, res) ->
  res.sendFile('sitemap.xml', {root : './public'})

app.use('/public', express.static(__dirname + '/../public', {maxAge : 86400000}))
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
app.listen port, () -> 
  console.log "Server running on port " + port

