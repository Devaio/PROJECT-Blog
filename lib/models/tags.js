"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var TagSchema = new mongoose_1.Schema({
    name: String,
});
exports.Tag = mongoose_1.model("Tag", TagSchema);
