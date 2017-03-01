import {Account} from '../models/accounts';
import passwords = require('../modules/passwords');
var passportLocal = require('passport-local');
import passport = require('passport')

var LocalStrategy = passportLocal.Strategy;

passport.serializeUser((user, done)=>{
    done(null, user)
})

passport.deserializeUser((obj, done)=>{
    done(null, obj)
})

passport.use(new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
}, (email, password, done)=>{
    Account.findOne({email : email}, (err, acct)=>{
        if(!err && acct){
            passwords.compare(password, acct.password, (isMatch)=>{
                if(!isMatch){
                    done(false, false);
                }
                else{
                    acct.password = '';
                    done(null, acct);
                }
            })
        }
        else{
            done(false);
        }
    });
}));