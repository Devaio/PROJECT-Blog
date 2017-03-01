"use strict";
var moment = require("moment");
var multipart = require("connect-multiparty");
var Middleware = (function () {
    function Middleware() {
    }
    Middleware.prototype.authorize = function (req, res, next) {
        if (!req.isAuthenticated()) {
            return res.redirect('/');
        }
        next();
    };
    Middleware.prototype.setLocals = function (req, res, next) {
        //add constants
        var timeStamp = moment().format('X');
        res.locals.user = req.user;
        res.locals.ENV = global.process.env.NODE_ENV === 'live' ? global.process.env.NODE_ENV : undefined;
        res.locals.timeStamp = timeStamp;
        res.locals.title = '';
        res.locals.description = '';
        res.locals.img = 'http://theviewfromhere.is/public/img/logo-fb.png';
        res.locals.url = '';
        res.locals.type = '';
        res.locals.requrl = "http://" + req.hostname + '/' + req.originalUrl;
        next();
    };
    Middleware.prototype.multi = function () {
        multipart();
    };
    Middleware.prototype.nocache = function (req, res, next) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        next();
    };
    return Middleware;
}());
module.exports = new Middleware();
//# sourceMappingURL=middleware.js.map