import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import Posts = require('../controllers/posts');
import Middleware = require('../modules/middleware');

export class ViewRoutes extends BaseRoute {
    public static create(router: Router) {
        //log
        console.log("[ViewRoutes::create] Creating view routes.");

        let RouteContainer = new ViewRoutes();

        router.get('/posts/:id', Middleware.setLocals, Posts.getPage)
        router.get('/*', RouteContainer.wildCard)


    }
    constructor() {
        super();
    }
    
    public wildCard(req: Request, res: Response){
        this.render(req, res, 'index')
    }
}



