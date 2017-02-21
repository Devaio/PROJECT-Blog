import { NextFunction, Request, Response } from "express";
import moment = require("moment");

export class BaseRoute {
    protected title: string;
    private scripts: string[];

    constructor() {
        //initialize variables
        this.title = "The View From Here";
        this.scripts = [];
    }
    public addScript(src: string): BaseRoute {
        this.scripts.push(src);
        return this;
    }

    public render(req: Request, res: Response, view: string, options?: Object) {

        
        //add scripts
        res.locals.scripts = this.scripts;

        //add title
        res.locals.title = this.title;

        //render view
        res.render(view, options);
    }
}

//add constants
        // var timeStamp = moment().format('X')
        // res.locals.user = req.user
        // res.locals.ENV = global.process.env.NODE_ENV === 'live' ?   global.process.env.NODE_ENV : undefined;
        // res.locals.timeStamp = timeStamp
        // res.locals.title = ''
        // res.locals.description = ''
        // res.locals.img = 'http://theviewfromhere.is/public/img/logo-fb.png'
        // res.locals.url = ''
        // res.locals.type = ''
        // res.locals.requrl = "http://" + req.hostname + '/' + req.originalUrl