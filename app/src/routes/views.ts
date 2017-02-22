import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";

export class ViewRoutes extends BaseRoute {
    public static create(router: Router) {
        //log
        console.log("[ViewRoutes::create] Creating view routes.");

        let RouteContainer = new ViewRoutes();

        router.get('/*', RouteContainer.wildCard)

    }
    constructor() {
        super();
    }
    
    public wildCard(req: Request, res: Response){
        this.render(req, res, 'index')
    }
}



