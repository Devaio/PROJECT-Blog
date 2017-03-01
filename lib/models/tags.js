"use strict";
var mongoose_1 = require("mongoose");
var TagSchema = new mongoose_1.Schema({
    name: String,
});
exports.Tag = mongoose_1.model("Tag", TagSchema);
//# sourceMappingURL=tags.js.map