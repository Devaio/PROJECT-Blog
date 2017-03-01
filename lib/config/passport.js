"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var accounts_1 = require("../models/accounts");
var passwords = require("../modules/passwords");
var passportLocal = require('passport-local');
var passport = require("passport");
var LocalStrategy = passportLocal.Strategy;
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    accounts_1.Account.findOne({ email: email }, function (err, acct) {
        if (!err && acct) {
            passwords.compare(password, acct.password, function (isMatch) {
                if (!isMatch) {
                    done(false, false);
                }
                else {
                    acct.password = '';
                    done(null, acct);
                }
            });
        }
        else {
            done(false);
        }
    });
}));
