"use strict";
var passport = require("passport");
var Auth = (function () {
    function Auth() {
    }
    Auth.prototype.performLogin = function (req, res, next, user) {
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            res.send({ user: user });
        });
    };
    Auth.prototype.login = function (req, res, next) {
        var _this = this;
        var authFunc = passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send({ error: 'No User!' });
            }
            _this.performLogin(req, res, next, user);
        });
        authFunc(req, res, next);
    };
    return Auth;
}());
module.exports = new Auth();
//# sourceMappingURL=auth.js.map