"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var moment = require("moment");
var _ = require("lodash");
var slug = require("slug");
var posts_1 = require("../models/posts");
var tags_1 = require("../models/tags");
var main_1 = require("./main");
var helpers = require("../modules/helpers");
var Posts = (function (_super) {
    __extends(Posts, _super);
    function Posts() {
        return _super.call(this, posts_1.Post) || this;
    }
    Posts.setPostLocals = function (post, res) {
        res.locals.title = post['title'];
        res.locals.description = post['preview'];
        res.locals.img = encodeURI(post['coverImg']);
        res.locals.url = 'http://theviewfromhere.is/posts/' + post['slug'];
        res.locals.type = 'article';
    };
    Posts.createTagList = function (newPostTags) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            function tagger(tag, tags, tagList, createdTagNames) {
                var tagIndex = createdTagNames.indexOf(tag);
                if (tagIndex === -1) {
                    var createTag = new tags_1.Tag({ name: tag });
                    createTag.save(function (err, doc) {
                        tagList.push(doc._id);
                        return new Promise(function (resolve) {
                            resolve(tagList);
                        });
                    });
                }
                else {
                    tagList.push(tags[tagIndex]._id);
                    return new Promise(function (resolve) {
                        resolve(tagList);
                    });
                }
            }
            var tagList;
            return __generator(this, function (_a) {
                tagList = [];
                return [2 /*return*/, new Promise(function (resolve) {
                        tags_1.Tag.find({ name: { $in: newPostTags } }, function (err, tags) { return __awaiter(_this, void 0, void 0, function () {
                            var createdTagNames, _i, newPostTags_1, tag;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        createdTagNames = tags.map(function (tag) {
                                            return tag.name;
                                        });
                                        _i = 0, newPostTags_1 = newPostTags;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < newPostTags_1.length)) return [3 /*break*/, 4];
                                        tag = newPostTags_1[_i];
                                        return [4 /*yield*/, tagger(tag, tags, tagList, createdTagNames)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4:
                                        resolve(tagList);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            });
        });
    };
    Posts.prototype.get = function (req, res, cb) {
        var q = { deleted: false };
        // Page Skipper
        var pageSkip = 0;
        var postLimit = +req.query.all || 10;
        if (req.query.page) {
            pageSkip = (req.query.page - 1) * 10;
        }
        if (req.query.deleted) {
            delete q.deleted;
        }
        // Create Tag Finder query
        if (req.query.tag) {
            tags_1.Tag.findOne({ name: req.query.tag }, function (err, tag) {
                if (tag) {
                    q['tags'] = { $elemMatch: { $eq: tag._id } };
                    posts_1.Post.find(q)
                        .sort('-createdAt')
                        .limit(postLimit)
                        .skip(pageSkip)
                        .populate('tags comments')
                        .exec(function (err, posts) {
                        if (posts) {
                            for (var _i = 0, posts_2 = posts; _i < posts_2.length; _i++) {
                                var post = posts_2[_i];
                                if (post) {
                                    helpers.toReadableDate(post);
                                }
                            }
                        }
                        res.send(posts || []);
                    });
                }
                else {
                    res.send([]);
                }
            });
        }
        else {
            if (req.params.id) {
                posts_1.Post.findOne({ _id: req.params.id, deleted: false })
                    .populate('tags')
                    .populate({
                    path: 'comments',
                    populate: {
                        path: 'subComments',
                        model: 'Comment'
                    }
                })
                    .exec(function (err, post) {
                    if (post) {
                        helpers.toReadableDate(post);
                        return res.send(post);
                    }
                    else {
                        posts_1.Post.findOne({ slug: req.params.id, deleted: false })
                            .populate('tags')
                            .populate({
                            path: 'comments',
                            populate: {
                                path: 'subComments',
                                model: 'Comment'
                            }
                        })
                            .exec(function (err, post) {
                            if (post) {
                                helpers.toReadableDate(post);
                                return res.send(post);
                            }
                            else {
                                res.send({ title: 'No Post' });
                            }
                        });
                    }
                });
            }
            else {
                posts_1.Post.find(q)
                    .sort('-createdAt')
                    .limit(postLimit)
                    .skip(pageSkip)
                    .populate('tags comments')
                    .exec(function (err, posts) {
                    if (posts) {
                        for (var _i = 0, posts_3 = posts; _i < posts_3.length; _i++) {
                            var post = posts_3[_i];
                            if (post) {
                                helpers.toReadableDate(post);
                                console.log(post.createdAt);
                            }
                        }
                    }
                    res.send(posts || []);
                });
            }
        }
    };
    Posts.prototype.random = function (req, res) {
        posts_1.Post
            .find({ deleted: false })
            .exec(function (err, posts) {
            var shufflePosts = _.shuffle(posts);
            res.send(shufflePosts.slice(0, 5));
        });
    };
    Posts.prototype.getDeleted = function (req, res) {
        posts_1.Post.find({ deleted: true })
            .sort('-createdAt')
            .exec(function (err, posts) {
            res.send(posts);
        });
    };
    Posts.prototype.delete = function (req, res) {
        _super.prototype.delete.call(this, req, res);
    };
    Posts.prototype.createPost = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var body, _a, newPost;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        body = req.body;
                        body.tags = body.tags.map(function (tag) {
                            return tag.toLowerCase();
                        });
                        // Create Tag List
                        _a = body;
                        return [4 /*yield*/, Posts.createTagList(body.tags)];
                    case 1:
                        // Create Tag List
                        _a.tags = _b.sent();
                        // Convert to Unix Time
                        body.createdAt = moment.unix(body.createdAt / 1000).format('X');
                        // Slugify title
                        if (body.title) {
                            body.slug = slug(body.title.toLowerCase());
                        }
                        // body['coverImg'].replace("http://theviewfromhere.is", "");
                        // body['pinImg'].replace("http://theviewfromhere.is", "");
                        console.log('BEFORE SAVE POST');
                        newPost = new posts_1.Post(body);
                        newPost.save(function (err, doc) {
                            if (err) {
                                res.send(err);
                            }
                            else {
                                res.send(doc);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Posts.prototype.updatePost = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var body, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        body = req.body;
                        body.tags = body.tags.map(function (tag) {
                            if (tag.name) {
                                return tag.name;
                            }
                            else {
                                return tag.toLowerCase();
                            }
                        });
                        _a = body;
                        return [4 /*yield*/, Posts.createTagList(body.tags)];
                    case 1:
                        _a.tags = _b.sent();
                        console.log("TAGS", body.tags);
                        // Convert to Unix Time
                        body.createdAt = moment(body.createdAt).format('X');
                        // Slugify title
                        if (body.title) {
                            body.slug = slug(body.title.toLowerCase());
                        }
                        posts_1.Post.findOneAndUpdate({ _id: req.params.id }, body, { new: true }, function (err, post) {
                            res.send(post);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Posts.prototype.getPage = function (req, res) {
        posts_1.Post.findOne({ _id: req.params.id, deleted: false }).populate('tags').populate({
            path: 'comments',
            populate: {
                path: 'subComments',
                model: 'Comment'
            }
        }).exec(function (err, post) {
            if (post) {
                helpers.toReadableDate(post);
                Posts.setPostLocals(post, res);
                return res.render('post', { post: post });
            }
            else {
                posts_1.Post.findOne({ slug: req.params.id, deleted: false }).populate('tags').populate({
                    path: 'comments',
                    populate: {
                        path: 'subComments',
                        model: 'Comment'
                    }
                }).exec(function (err, post) {
                    if (post) {
                        helpers.toReadableDate(post);
                        Posts.setPostLocals(post, res);
                        return res.render('post', { post: post });
                    }
                    else {
                        res.render('post', { post: { title: 'No Post' } });
                    }
                });
            }
        });
    };
    return Posts;
}(main_1.MainController));
module.exports = new Posts();
