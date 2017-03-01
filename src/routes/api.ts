import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import Posts = require('../controllers/posts');
import Auth = require('../controllers/auth');
import Comments = require('../controllers/comments');
import Accounts = require('../controllers/accounts');
import Media = require('../controllers/media');
import Tags = require('../controllers/tags');
import request = require('request');

import Middleware = require('../modules/middleware');

export class ApiRoutes extends BaseRoute {
    public static create(router: Router) {
        //log
        console.log("[ApiRoutes::create] Creating api routes.");


        router.get('/posts/:id', Middleware.setLocals, Posts.getPage)

        router.get('/api/me', (req: Request, res: Response) => {
            res.send({ user: req.user });
        })

        router.get('/api/posts', Posts.get)
        router.get('/api/posts/random', Posts.random)
        router.get('/api/posts/:id', Posts.get)
        router.post('/api/posts', Middleware.authorize, Posts.createPost)
        router.post('/api/posts/:id', Middleware.authorize, Posts.updatePost)
        router.get('/api/posts/delete/:id', Middleware.authorize, Posts.delete)
        router.delete('/api/posts/:id', Middleware.authorize, Posts.delete)


        router.get('/api/tags', Tags.get)
        router.get('/api/tags/:id', Tags.get)

        router.post('/api/media', Middleware.multi, Media.uploadFiles)

        router.get('/api/comments', Middleware.authorize, Comments.get)
        router.post('/api/comments/create/:postID', Comments.createComment)
        router.post('/api/comments/:id', Comments.updateComment)
        router.delete('/api/comments/:id', Middleware.authorize, Comments.delete)

        router.post('/admin/login', Auth.login)

        router.post('/api/subscribe', (req: Request, res: Response) => {
            request({
                url: '',
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + process.env.SENDGRID_KEY

                },
                json: true,
                body: [
                    {
                        email: req.body.email
                    }
                ]
            }, (err, resp, body) => {
                res.send(body)
            })
        })




    }
    constructor() {
        super();
    }

}



