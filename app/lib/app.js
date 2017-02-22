"use strict";
var express = require("express");
var fs = require("fs");
var env = require("node-env-file");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var session = require("express-session");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var multipart = require("connect-multiparty");
var multiMiddle = multipart();
var port = process.env.PORT || 3000;
// Route Imports
var views_1 = require("./views");
if (typeof (global.process.env.NODE_ENV) === 'undefined') {
    if (fs.existsSync(__dirname + '../../env/development.ev')) {
        env(__dirname + '../../env/development.ev');
    }
}
mongoose.connect(global.process.env.DB_URI, function (err) {
    console.log(err);
});
var Server = (function () {
    function Server() {
        //create expressjs application
        this.app = express();
        //configure application
        this.config();
        //add routes
        this.routes();
        //add api
        this.api();
    }
    Server.startup = function () {
        return new Server();
    };
    Server.prototype.api = function () {
        //empty for now
    };
    Server.prototype.config = function () {
        this.app.set('view engine', 'pug');
        this.app.set('views', __dirname + '/../views');
        // Static File Server
        this.app.use('/public', express.static(__dirname + '/../public', { maxAge: 86400000 }));
        // Parsing Middleware
        this.app.use(bodyParser.urlencoded({ extended: true }), bodyParser.json(), cookieParser());
        // Sessions
        this.app.use(session({
            secret: global.process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true
        }));
        // Passport
        this.app.use(passport.initialize(), passport.session());
        // certbot
        // app.use('/.well-known', express.static(__dirname + '/../public/.well-known', {maxAge : 86400000}))
        // Prerender.io
        // app.use(require('prerender-node').set('prerenderToken', 'HvuxVE0VSpnkqjIBIn0p'));
        this.app.listen(port, function (err) {
            console.log(err, "Server Running on " + port + "!");
        });
    };
    Server.prototype.routes = function () {
        var router;
        router = express.Router();
        views_1.ViewRoutes.create(router);
        this.app.use(router);
    };
    return Server;
}());
exports.Server = Server;
// Start Server
var app = Server.startup().app;
//# sourceMappingURL=app.js.map