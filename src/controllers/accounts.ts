import { Model } from 'mongoose';
import { Account } from '../models/accounts';
import { NextFunction, Request, Response } from "express";
import helpers = require('../modules/helpers');
import {MainController} from './main';


class Accounts extends MainController {

    constructor (){
        super(Account);
    }

    public get (req: Request, res: Response, cb?: Function){
        super.get(req, res, cb ? cb : ()=>{});
    }

    public delete (req: Request, res: Response, cb?: Function){
        super.delete(req, res, cb ? cb : ()=>{});
        
    }

    public upsert (req: Request, res: Response, cb?: Function){

        let body = req.body;
        let user = {};

        if(body.pass1){
            if(!body.name ||
                !body.email ||
                !body.pass1 ||
                !body.pass2 ||
                body.pass1 !== body.pass2){
                
                return res.send(JSON.stringify({error : 'Please complete the form'}))

            }
            user['password'] = body.pass1;
        }
        user['email'] = body.email;
        user['name'] = body.name;

        super.upsert(req, res, user);

    }
    public createAccount (req: Request, res: Response, cb?: Function){
        let body = req.body;
        let user = {};

        if(body.pass1){
            if(!body.name ||
                !body.email ||
                !body.pass1 ||
                !body.pass2 ||
                body.pass1 !== body.pass2){
                
                return res.send(JSON.stringify({error : 'Please complete the form'}))

            }
            user['password'] = body.pass1;
        }
        user['email'] = body.email;
        user['name'] = body.name;

        let acc = new Account(user);
        acc.save(()=>{
            req.login(acc, ()=>{
                res.redirect('/');
            });
        });
    }

}

export = new Accounts();