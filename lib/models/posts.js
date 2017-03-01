"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var moment = require("moment");
var PostSchema = new mongoose_1.Schema({
    title: String,
    slug: String,
    coverImg: String,
    pinImg: String,
    preview: String,
    content: String,
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Tag' }],
    createdAt: String,
    deleted: { type: Boolean, default: false },
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' }]
});
PostSchema.path('createdAt').default(function () {
    return moment().format('X');
});
PostSchema.index({ slug: 1 });
exports.Post = mongoose_1.model("Post", PostSchema);
