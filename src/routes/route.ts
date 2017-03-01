import { NextFunction, Request, Response } from "express";
import moment = require("moment");

export class BaseRoute {
    protected title: string;
    private scripts: string[];

    constructor() {
        //initialize variables
        // this.title = "The View From Here";
    }


    public render(req: Request, res: Response, view: string, options?: Object) {

        //add title
        // res.locals.title = this.title;

        //render view
        res.render(view, options);
    }
}

