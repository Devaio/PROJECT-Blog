var Account, Accounts, Main, mongoose,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mongoose = require('mongoose');

Account = mongoose.model('Account');

Main = require('./main');

Accounts = (function(_super) {
  __extends(Accounts, _super);

  function Accounts() {
    Accounts.__super__.constructor.call(this, Account);
  }

  Accounts.prototype.get = function(req, res) {
    return Accounts.__super__.get.call(this, req, res);
  };

  Accounts.prototype["delete"] = function(req, res) {
    return Accounts.__super__["delete"].call(this, req, res);
  };

  Accounts.prototype.upsert = function(req, res) {
    var body, self, user;
    self = this;
    body = req.body;
    user = {};
    if (body.pass1) {
      if (!body.name || !body.email || !body.pass1 || !body.pass2 || body.pass1 !== body.pass2) {
        res.send(JSON.stringify({
          error: 'Please complete the form'
        }));
        return;
      }
      user.password = body.pass1;
    }
    user.name = body.name;
    user.email = body.email;
    return Accounts.__super__.upsert.call(this, user, req, res);
  };

  Accounts.prototype.createAccount = function(req, res) {
    var acc, body, self, user;
    self = this;
    body = req.body;
    user = {};
    console.log(req.body);
    if (body.pass1) {
      if (!body.name || !body.email || !body.pass1 || !body.pass2 || body.pass1 !== body.pass2) {
        res.send(JSON.stringify({
          error: 'Please complete the form'
        }));
        return;
      }
      user.password = body.pass1;
    }
    user.name = body.name;
    user.email = body.email;
    acc = new Account(user);
    return acc.save(function() {
      return req.login(acc, function() {
        return res.redirect('/');
      });
    });
  };

  return Accounts;

})(Main);

module.exports = new Accounts();
