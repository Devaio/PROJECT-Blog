"use strict";
var crypto = require("crypto");
var Password = (function () {
    function Password() {
    }
    Password.prototype.encrypt = function (password) {
        return crypto.createHash('sha512').update(password).digest('hex');
    };
    Password.prototype.compare = function (password, userPassword, cb) {
        cb(this.encrypt(password) === userPassword ? true : false);
    };
    return Password;
}());
module.exports = new Password();
//# sourceMappingURL=passwords.js.map