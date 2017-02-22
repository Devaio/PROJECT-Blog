import express = require('express');
import fs = require('fs');
import env = require('node-env-file');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');
mongoose.Promise = global.Promise;
import session = require('express-session');
import cookieParser = require('cookie-parser');
import passport = require('passport');
import multipart = require('connect-multiparty');
var multiMiddle = multipart();
var port = process.env.PORT || 3000;

// Route Imports
import { ViewRoutes } from './views';


if (typeof (global.process.env.NODE_ENV) === 'undefined') {
    if (fs.existsSync(__dirname + '../../env/development.ev')) {
        env(__dirname + '../../env/development.ev');
    }
}

mongoose.connect(global.process.env.DB_URI, (err) => {
    console.log(err);
})

export class Server {
    public app: express.Application;

    public static startup(): Server {
        return new Server();
    }

    constructor() {
        //create expressjs application
        this.app = express();

        //configure application
        this.config();

        //add routes
        this.routes();

        //add api
        this.api();

    }


    public api() {
        //empty for now
    }


    public config() {
        this.app.set('view engine', 'pug');
        this.app.set('views', __dirname + '/../views');

        // Static File Server
        this.app.use('/public', express.static(__dirname + '/../public', { maxAge: 86400000 }));

        // Parsing Middleware
        this.app.use(bodyParser.urlencoded({extended : true}), bodyParser.json(), cookieParser());

        // Sessions
        this.app.use(session({
            secret : global.process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true
        }));

        // Passport
        this.app.use(passport.initialize(), passport.session())

        // certbot
        // app.use('/.well-known', express.static(__dirname + '/../public/.well-known', {maxAge : 86400000}))

        // Prerender.io
        // app.use(require('prerender-node').set('prerenderToken', 'HvuxVE0VSpnkqjIBIn0p'));


        this.app.listen(port, (err) =>{
            console.log(err, `Server Running on ${port}!`);
        });
    }


    private routes() {
        let router: express.Router;
        router = express.Router();

        ViewRoutes.create(router);

        this.app.use(router);
        
    }
}





// Start Server
var app = Server.startup().app;