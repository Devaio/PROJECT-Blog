"use strict";
var moment = require("moment");
var Helpers = (function () {
    function Helpers() {
        this.toReadableDate = function (doc) {
            doc.createdAt = moment.unix(doc.createdAt).format('MMM DD, YYYY');
        };
        this.toUnixDate = function (doc) {
            doc.createdAt = moment(doc.createdAt).format('X');
        };
        this.toJSDate = function (doc) {
            doc.createdAt = moment.unix(doc.createdAt).toDate();
        };
    }
    Helpers.prototype.queryBuilder = function (req) {
        var queryParams = req.query;
        var id = req.params.id ? req.params.id : null;
        var filter = req.params.filter ? req.params.filter : null;
        var value = req.params.value ? req.params.value : null;
        var sort = req.params.sort ? req.params.sort : null;
        var orderBy = req.params.orderBy ? req.params.orderBy : 'asc';
        var deleted = queryParams.deleted;
        var query = {};
        var sortQuery = {};
        if (id) {
            query['_id'] = id;
        }
        if (filter) {
            if (value) {
                query[filter] = value;
            }
        }
        if (sort) {
            sortQuery[sort] = 1;
            if (orderBy && (orderBy === 'desc')) {
                sortQuery[sort] = -1;
            }
        }
        if (deleted) {
            query['deleted'] = deleted;
        }
        return {
            query: query,
            sortQuery: sortQuery
        };
    };
    return Helpers;
}());
module.exports = new Helpers();
