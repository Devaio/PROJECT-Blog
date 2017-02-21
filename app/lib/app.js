"use strict";
var fs = require("fs");
var env = require("node-env-file");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var multipart = require("connect-multiparty");
var multiMiddle = multipart();
if (typeof (global.process.env.NODE_ENV) === 'undefined') {
    if (fs.existsSync(__dirname + '../../env/development.ev')) {
        env(__dirname + '../../env/development.ev');
    }
}
mongoose.connect(global.process.env.DB_URI, function (err) {
    console.log(err);
});
var Server = (function () {
    function Server() {
    }
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=app.js.map