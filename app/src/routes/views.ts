import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";

export class ViewRoutes extends BaseRoute {
    public static create(router: Router) {
        //log
        console.log("[ViewRoutes::create] Creating index route.");

        //add home page route
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            new ViewRoutes().index(req, res, next);
        });
    }
    constructor() {
        super();
    }
    public index(req: Request, res: Response, next: NextFunction) {
        //set custom title
        this.title = "Home | Tour of Heros";

        //set options
        let options: Object = {
            "message": "Welcome to the Tour of Heros"
        };

        //render template
        this.render(req, res, "index", options);
    }
}