import { Model, Document, Types } from 'mongoose';
import { NextFunction, Request, Response } from "express";
import moment = require('moment');
import _ = require('lodash');
import slug = require('slug');
import { Post } from '../models/posts';
import { Tag } from '../models/tags';
import { MainController } from './main';
import helpers = require('../modules/helpers');
import Mailer = require('../modules/mailer');



class Posts extends MainController {

    constructor() {
        super(Post);
    }

    private static setPostLocals(post: Document, res: Response) {
        res.locals.title = post['title']
        res.locals.description = post['preview']
        res.locals.img = 'http://theviewfromhere.is' + post['coverImg']
        res.locals.url = 'http://theviewfromhere.is/posts/' + post['slug']
        res.locals.type = 'article'
    }

    private static async createTagList(newPostTags: Array<string>) {
        var tagList: Array<Types.ObjectId> = [];
        function tagger(tag, tags, tagList, createdTagNames) {
            let tagIndex: number = createdTagNames.indexOf(tag);

            if (tagIndex === -1) {
                let createTag = new Tag({ name: tag });
                createTag.save((err, doc) => {
                    tagList.push(doc._id);
                    return new Promise<Array<Types.ObjectId>>((resolve) => {
                        resolve(tagList);
                    })
                })
            }
            else {
                tagList.push(tags[tagIndex]._id);
                return new Promise<Array<Types.ObjectId>>((resolve) => {
                    resolve(tagList);
                })
            }
        }

        Tag.find({ name: { $in: newPostTags } }, async (err, tags) => {
            let createdTagNames = tags.map((tag) => {
                return tag.name
            });

            for (let tag of newPostTags) {

                await tagger(tag, tags, tagList, createdTagNames);

            }

            return new Promise<Array<Types.ObjectId>>((resolve) => {
                return tagList
            })
        })
    }

    public get(req: Request, res: Response, cb?: Function) {
        let q = { deleted: false };

        // Page Skipper
        let pageSkip: number = 0;
        let postLimit: number = +req.query.all || 10;

        if (req.query.page) {
            pageSkip = (req.query.page - 1) * 10;
        }

        if (req.query.deleted) {
            delete q.deleted;
        }

        // Create Tag Finder query
        if (req.query.tag) {
            Tag.findOne({ name: req.query.tag }, (err, tag) => {

                if (tag) {
                    q['tags'] = { $elemMatch: { $eq: tag._id } };

                    Post.find(q)
                        .sort('-createdAt')
                        .limit(postLimit)
                        .skip(pageSkip)
                        .populate('tags comments')
                        .exec((err, posts) => {
                            if (posts) {
                                for (let post of posts) {
                                    if (post) {
                                        helpers.toReadableDate(post);
                                    }
                                }
                            }
                            res.send(posts || []);
                        })
                }
                else {
                    res.send([]);
                }
            });
        }

        else {
            if (req.params.id) {
                Post.findOne({ _id: req.params.id, deleted: false })
                    .populate('tags')
                    .populate({
                        path: 'comments',
                        populate: {
                            path: 'subComments',
                            model: 'Comment'
                        }
                    })
                    .exec((err, post) => {
                        if (post) {
                            helpers.toReadableDate(post);
                            return res.send(post);
                        }
                        else {
                            Post.findOne({ slug: req.params.id, deleted: false })
                                .populate('tags')
                                .populate({
                                    path: 'comments',
                                    populate: {
                                        path: 'subComments',
                                        model: 'Comment'
                                    }
                                })
                                .exec((err, post) => {
                                    if (post) {
                                        helpers.toReadableDate(post);
                                        return res.send(post);
                                    }
                                    else {
                                        res.send({ title: 'No Post' })
                                    }

                                })
                        }
                    })
            }
            else {
                Post.find(q)
                    .sort('-createdAt')
                    .limit(postLimit)
                    .skip(pageSkip)
                    .populate('tags comments')
                    .exec((err, posts) => {
                        if (posts) {
                            for (let post of posts) {
                                if (post) {
                                    helpers.toReadableDate(post);
                                }
                            }
                        }
                        res.send(posts || []);
                    })
            }
        }


    }

    public random(req: Request, res: Response) {
        Post
            .find()
            .exec((err, posts) => {
                let shufflePosts = _.shuffle(posts)
                res.send(shufflePosts.slice(0, 5))
            });

    }

    public getDeleted(req: Request, res: Response) {
        Post.find({ deleted: true })
            .sort('-createdAt')
            .exec((err, posts) => {
                res.send(posts);
            })
    }

    public delete(req: Request, res: Response) {
        super.delete(req, res);
    }

    public async createPost(req: Request, res: Response) {
        let body = req.body;

        body.tags = body.tags.map((tag) => {
            return tag.toLowerCase();
        })

        // Create Tag List
        body.tags = await Posts.createTagList(body.tags);

        // Convert to Unix Time
        body.createdAt = moment.unix(body.createdAt / 1000).format('X')

        // Slugify title
        if (body.title) {
            body.slug = slug(body.title.toLowerCase());
        }

        console.log('BEFORE SAVE POST')

        let newPost = new Post(body);
        newPost.save((err, doc) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(doc)
            }
        });

    }

    public async updatePost(req: Request, res: Response) {
        let body = req.body;

        body.tags = body.tags.map((tag) => {
            if (tag.name) {
                return tag.name
            }
            else {
                return tag.toLowerCase();
            }
        })

        body.tags = await Posts.createTagList(body.tags);

        // Convert to Unix Time
        body.createdAt = moment.unix(body.createdAt / 1000).format('X')

        // Slugify title
        if (body.title) {
            body.slug = slug(body.title.toLowerCase());
        }

        Post.findOneAndUpdate({ _id: req.params.id }, body, { new: true }, (err, post) => {
            res.send(post)
        })
    }

    public getPage(req: Request, res: Response) {
        Post.findOne({ _id: req.params.id, deleted: false }).populate('tags').populate({
            path: 'comments',
            populate: {
                path: 'subComments',
                model: 'Comment'
            }
        }).exec((err, post) => {
            if (post) {
                helpers.toReadableDate(post);
                Posts.setPostLocals(post, res);
                return res.render('post', { post: post });
            }
            else {
                Post.findOne({ slug: req.params.id, deleted: false }).populate('tags').populate({
                    path: 'comments',
                    populate: {
                        path: 'subComments',
                        model: 'Comment'
                    }
                }).exec((err, post) => {
                    if (post) {
                        helpers.toReadableDate(post);
                        Posts.setPostLocals(post, res);
                        return res.render('post', { post: post });
                    }
                    else{
                        res.render('post', {post : {title : 'No Post'}});
                    }
                })
            }
        })
    }

}

export = new Posts();