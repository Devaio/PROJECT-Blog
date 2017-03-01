"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var comments_1 = require("../models/comments");
var posts_1 = require("../models/posts");
var main_1 = require("./main");
var Mailer = require("../modules/mailer");
var _ = require("lodash");
var Comments = (function (_super) {
    __extends(Comments, _super);
    function Comments() {
        return _super.call(this, comments_1.Comment) || this;
    }
    Comments.prototype.sendCommentMail = function (body, doc) {
        Mailer.send('651f0a1f-81a9-49ab-9b78-9e801d23c914', [
            {
                name: '%name%',
                content: "<h2>" + doc['name'] + "</h2>"
            },
            {
                name: '%comment%',
                content: "<h4>" + doc['content'] + "</h4>"
            }
        ], {
            to: body['parentComment'].email,
            from: 'services@theviewfromhere.is'
        });
    };
    Comments.prototype.get = function (req, res, cb) {
        comments_1.Comment.find({ approved: false })
            .sort('post')
            .populate('post')
            .exec(function (err, docs) {
            var groupedComments = _.groupBy(docs, function (doc) {
                return doc.post['title'];
            });
            res.send(groupedComments);
        });
    };
    Comments.prototype.delete = function (req, res) {
        comments_1.Comment.remove({ _id: req.params.id }, function (err) {
            res.send(err);
        });
    };
    Comments.prototype.createComment = function (req, res) {
        var _this = this;
        var body = req.body;
        body['post'] = req.params.postID;
        var newComment = new comments_1.Comment(body);
        newComment.save(function (err, doc) {
            if (err) {
                return res.send(err);
            }
            else {
                if (doc.isSubComment) {
                    res.send(doc);
                    if (doc.sendEmail === true && body['parentComment'].email) {
                        _this.sendCommentMail(body, doc);
                    }
                }
                else {
                    posts_1.Post.findOne({ _id: req.params.postID }, function (err, foundPost) {
                        foundPost.comments = foundPost.comments || [];
                        foundPost.comments.push(doc._id);
                        foundPost.save();
                        res.send(doc);
                    });
                }
            }
        });
    };
    Comments.prototype.updateComment = function (req, res) {
        var _this = this;
        var body = req.body;
        comments_1.Comment.findOneAndUpdate({ _id: req.params.id }, body, { new: true }, function (err, doc) {
            res.send(doc);
            if (doc.isSubComment) {
                comments_1.Comment.findOne({ subComments: doc._id }, function (err, parentComment) {
                    if (parentComment && parentComment.sendEmail && parentComment.email) {
                        _this.sendCommentMail(body, doc);
                    }
                });
            }
        });
    };
    return Comments;
}(main_1.MainController));
module.exports = new Comments();
//# sourceMappingURL=comments.js.map