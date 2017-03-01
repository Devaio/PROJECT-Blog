"use strict";
var mongoose_1 = require("mongoose");
var CommentSchema = new mongoose_1.Schema({
    name: String,
    email: String,
    website: String,
    content: String,
    approved: { type: Boolean, default: false },
    createdAt: String,
    deleted: { type: Boolean, default: false },
    post: { type: mongoose_1.Types.ObjectId, ref: 'Post' },
    isSubComment: { type: Boolean, default: false },
    subComments: [{ type: mongoose_1.Types.ObjectId, ref: 'Comment' }],
    sendEmail: { type: Boolean, default: false }
});
exports.Comment = mongoose_1.model("Comment", CommentSchema);
//# sourceMappingURL=comments.js.map