"use strict";
var passport = require("passport");
var Auth = (function () {
    function Auth() {
    }
    Auth.performLogin = function (req, res, next, user) {
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            res.send({ user: user });
        });
    };
    Auth.prototype.login = function (req, res, next) {
        var authFunc = passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send({ error: 'No User!' });
            }
            Auth.performLogin(req, res, next, user);
        });
        authFunc(req, res, next);
    };
    return Auth;
}());
module.exports = new Auth();
