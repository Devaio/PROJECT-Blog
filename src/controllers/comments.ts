import { Model, Document } from 'mongoose';
import { Comment } from '../models/comments';
import { Post } from '../models/posts';
import { NextFunction, Request, Response } from "express";
import helpers = require('../modules/helpers');
import { MainController } from './main';
import Mailer = require('../modules/mailer');
import fs = require('fs');
import moment = require('moment');
import _ = require('lodash');


class Comments extends MainController {

    constructor() {
        super(Comment);
    }

    private static sendCommentMail(body:Object, doc: Document) {
        Mailer.send(
            '651f0a1f-81a9-49ab-9b78-9e801d23c914',
            [
                {
                    name: '%name%',
                    content: "<h2>" + doc['name'] + "</h2>"
                },
                {
                    name: '%comment%',
                    content: "<h4>" + doc['content'] + "</h4>"
                }
            ],
            {
                to: body['parentComment'].email,
                from: 'services@theviewfromhere.is'
            }

        )
    }

    public get(req: Request, res: Response, cb?: Function) {
        Comment.find({ approved: false })
            .sort('post')
            .populate('post')
            .exec((err, docs) => {
                let groupedComments = _.groupBy(docs, (doc) => {
                    return doc.post['title'];
                })
                res.send(groupedComments);
            })
    }

    public delete(req: Request, res: Response) {
        Comment.remove({_id : req.params.id}, (err) =>{
			res.send(err);
        })
    }

    public createComment(req: Request, res: Response) {

        let body: Object = req.body;

        body['post'] = req.params.postID;
        let newComment = new Comment(body);
        newComment.save((err, doc) => {
            if (err) {
                return res.send(err)
            }
            else {
                if (doc.isSubComment) {
                    res.send(doc);
                    if (doc.sendEmail === true && body['parentComment'].email) {
                        Comments.sendCommentMail(body, doc);
                    }
                }
                else {
                    Post.findOne({ _id: req.params.postID }, (err, foundPost) => {
                        foundPost.comments = foundPost.comments || [];
                        foundPost.comments.push(doc._id);
                        foundPost.save();
                        res.send(doc);
                    })
                }
            }
        })



    }

    public updateComment(req: Request, res: Response) {
        let body: Object = req.body;
        Comment.findOneAndUpdate({_id : req.params.id}, body, {new : true}, (err, doc)=>{
            res.send(doc);

            if(doc.isSubComment){
                Comment.findOne({subComments : doc._id}, (err, parentComment)=>{
                    if(parentComment && parentComment.sendEmail && parentComment.email){
                        Comments.sendCommentMail(body, doc);
                    }
                })
            }
        })
    }


}

export = new Comments();