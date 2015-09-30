var Main, helpers, mongoose,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

helpers = require('../modules/helpers');

mongoose = require('mongoose');

module.exports = Main = (function() {
  function Main(model) {
    this.model = model;
    this.upsert = __bind(this.upsert, this);
    this["delete"] = __bind(this["delete"], this);
    this.get = __bind(this.get, this);
  }

  Main.prototype.get = function(req, res, cb) {
    var q;
    cb = cb != null ? cb : function() {};
    q = helpers.queryBuilder(req);
    return this.model.find(q.query).sort(q.sortQuery).exec(function(err, data) {
      res.send(data);
      return cb();
    });
  };

  Main.prototype["delete"] = function(req, res, cb) {
    var id;
    cb = cb != null ? cb : function() {};
    id = req.params.id != null ? req.params.id : false;
    if (!id) {
      return res.send({
        error: "Please provide a user ID."
      });
    }
    return this.model.findOneAndUpdate({
      _id: id
    }, {
      deleted: true
    }, function(err, data) {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
      return cb();
    });
  };

  Main.prototype.upsert = function(data, req, res, cb) {
    var newModelInstance, query, self;
    self = this;
    cb = cb != null ? cb : function() {};
    if (req.params.id != null) {
      query = {
        _id: req.params.id
      };
      return this.model.update(query, data, function(err, data) {
        if (err) {
          console.log(err);
          res.send(JSON.stringify({
            error: 'An error occured. Please try again.'
          }));
        } else {
          res.send(data);
        }
        return cb();
      });
    } else {
      console.log(this.model);
      newModelInstance = new this.model(data);
      return newModelInstance.save(function(err, doc) {
        if (err) {
          console.log(err);
          res.send(JSON.stringify({
            error: 'An error occured. Please try again.'
          }));
        } else {
          res.send(doc);
        }
        return cb();
      });
    }
  };

  return Main;

})();
