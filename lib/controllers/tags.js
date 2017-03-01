"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var tags_1 = require("../models/tags");
var main_1 = require("./main");
var Tags = (function (_super) {
    __extends(Tags, _super);
    function Tags() {
        return _super.call(this, tags_1.Tag) || this;
    }
    Tags.prototype.get = function (req, res) {
        if (req.query.name) {
            tags_1.Tag.findOne({ name: req.query.name }, function (err, tag) {
                if (tag) {
                    res.send(tag);
                }
                else {
                    res.send({ name: req.query.name });
                }
            });
        }
        else {
            tags_1.Tag.find({}, function (err, tags) {
                res.send(tags);
            });
        }
    };
    Tags.prototype.delete = function (req, res) {
        _super.prototype.delete.call(this, req, res);
    };
    return Tags;
}(main_1.MainController));
module.exports = new Tags();
