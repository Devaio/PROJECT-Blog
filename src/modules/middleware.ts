import { NextFunction, Request, Response, Router } from "express";
import moment = require('moment');
import multipart = require('connect-multiparty');
class Middleware {
    public authorize (req: Request, res: Response, next: NextFunction){
        
        if(!req.isAuthenticated()){
            return res.redirect('/');
        }
        next();
    }

    public setLocals (req: Request, res: Response, next: NextFunction){

        //add constants
        var timeStamp = moment().format('X')
        res.locals.user = req.user
        res.locals.ENV = global.process.env.NODE_ENV === 'live' ?   global.process.env.NODE_ENV : undefined;
        res.locals.timeStamp = timeStamp
        res.locals.title = ''
        res.locals.description = ''
        res.locals.img = 'http://theviewfromhere.is/public/img/logo-fb.png'
        res.locals.url = ''
        res.locals.type = ''
        res.locals.requrl = "http://" + req.hostname + '/' + req.originalUrl        
        next();
    }
    public multi (){
        return multipart();
    }
    public nocache (req:Request, res:Response, next:NextFunction){
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
		res.header('Expires', '-1')
		res.header('Pragma', 'no-cache')
		next()
    }
}

export = new Middleware();