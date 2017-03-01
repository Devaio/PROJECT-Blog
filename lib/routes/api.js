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
Object.defineProperty(exports, "__esModule", { value: true });
var route_1 = require("./route");
var Posts = require("../controllers/posts");
var Auth = require("../controllers/auth");
var Comments = require("../controllers/comments");
var Media = require("../controllers/media");
var Tags = require("../controllers/tags");
var request = require("request");
var multipart = require("connect-multiparty");
var Middleware = require("../modules/middleware");
var ApiRoutes = (function (_super) {
    __extends(ApiRoutes, _super);
    function ApiRoutes() {
        return _super.call(this) || this;
    }
    ApiRoutes.create = function (router) {
        //log
        console.log("[ApiRoutes::create] Creating api routes.");
        router.get('/posts/:id', Middleware.setLocals, Posts.getPage);
        router.get('/api/me', function (req, res) {
            res.send({ user: req.user });
        });
        router.get('/api/posts', Posts.get);
        router.get('/api/posts/random', Posts.random);
        router.get('/api/posts/:id', Posts.get);
        router.post('/api/posts', Middleware.authorize, Posts.createPost);
        router.post('/api/posts/:id', Middleware.authorize, Posts.updatePost);
        router.get('/api/posts/delete/:id', Middleware.authorize, Posts.delete);
        router.delete('/api/posts/:id', Middleware.authorize, Posts.delete);
        router.get('/api/tags', Tags.get);
        router.get('/api/tags/:id', Tags.get);
        router.post('/api/media', multipart(), Media.uploadFiles);
        router.get('/api/comments', Middleware.authorize, Comments.get);
        router.post('/api/comments/create/:postID', Comments.createComment);
        router.post('/api/comments/:id', Comments.updateComment);
        router.delete('/api/comments/:id', Middleware.authorize, Comments.delete);
        router.post('/admin/login', Auth.login);
        router.post('/api/subscribe', function (req, res) {
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
            }, function (err, resp, body) {
                res.send(body);
            });
        });
    };
    return ApiRoutes;
}(route_1.BaseRoute));
exports.ApiRoutes = ApiRoutes;
