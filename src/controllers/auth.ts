import passport = require('passport');
import { NextFunction, Request, Response } from "express";
import {Document} from 'mongoose';



class Auth {

    constructor (){
    }

    public static performLogin (req: Request, res: Response, next: NextFunction, user:Document){
        
        req.login(user, (err)=>{
            if(err){
                return next(err);
            }

            res.send({user : user});
        })
    }

    public login (req: Request, res: Response, next: NextFunction){
        let authFunc = passport.authenticate('local', (err, user, info)=>{
            if(err){
                return next(err);
            }

            if(!user){
                return res.send({error : 'No User!'});
            }

            Auth.performLogin(req, res, next, user);
        })

        authFunc(req, res, next);
    }

}

export = new Auth();