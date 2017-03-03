"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var moment = require("moment");
var CommentSchema = new mongoose_1.Schema({
    name: String,
    email: String,
    website: String,
    content: String,
    approved: { type: Boolean, default: false },
    createdAt: String,
    deleted: { type: Boolean, default: false },
    post: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Post' },
    isSubComment: { type: Boolean, default: false },
    subComments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' }],
    sendEmail: { type: Boolean, default: false }
});
CommentSchema.path('createdAt').default(function () {
    return moment().format('X');
});
exports.Comment = mongoose_1.model("Comment", CommentSchema);
