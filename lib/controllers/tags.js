var Main, Tag, Tags, mongoose,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mongoose = require('mongoose');

Tag = mongoose.model('Tag');

Main = require('./main');

Tags = (function(_super) {
  __extends(Tags, _super);

  function Tags() {
    Tags.__super__.constructor.call(this, Tag);
  }

  Tags.prototype.get = function(req, res) {
    if (req.query.name) {
      return Tag.findOne({
        name: req.query.name
      }, function(err, tag) {
        if (tag) {
          return res.send(tag);
        } else {
          return res.send({
            name: req.query.name
          });
        }
      });
    } else {
      return Tag.find({}, function(err, tags) {
        return res.send(tags);
      });
    }
  };

  Tags.prototype["delete"] = function(req, res) {
    return Tags.__super__["delete"].call(this, req, res);
  };

  return Tags;

})(Main);

module.exports = new Tags();
