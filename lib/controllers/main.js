"use strict";
var helpers = require("../modules/helpers");
var MainController = (function () {
    function MainController(model) {
        this.model = model;
    }
    MainController.prototype.get = function (req, res, cb) {
        if (req.params.id) {
            this.model.findOne({ _id: req.params.id }, function (err, data) {
                res.send(data);
                cb ? cb() : null;
            });
        }
        else {
            var q = helpers.queryBuilder(req);
            this.model.find(q.query).sort(q.sortQuery).exec(function (err, data) {
                res.send(data);
                cb ? cb() : null;
            });
        }
    };
    MainController.prototype.upsert = function (req, res, data, cb) {
        var self = this;
        if (req.params.id) {
            var query = { _id: req.params.id };
            this.model.update(query, data, function (err, data) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(data);
                }
                cb ? cb() : null;
            });
        }
        else {
            var newModelInstance = new this.model(data);
            newModelInstance.save(function (err, doc) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(doc);
                }
                cb ? cb() : null;
            });
        }
    };
    MainController.prototype.delete = function (req, res, cb) {
        if (req.params.id) {
            this.model.findOneAndUpdate({ _id: req.params.id }, { deleted: true }, function (err, data) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(data);
                }
                cb ? cb() : null;
            });
        }
        else {
            res.send({ error: "Please provide more info" });
        }
    };
    return MainController;
}());
exports.MainController = MainController;
//# sourceMappingURL=main.js.map