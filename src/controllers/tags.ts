import { Model, Document, Types } from 'mongoose';
import { NextFunction, Request, Response } from "express";
import moment = require('moment');
import { Tag } from '../models/tags';
import { MainController } from './main';



class Tags extends MainController {

    constructor() {
        super(Tag);
    }

    public get(req:Request, res:Response){
        if(req.query.name){
            Tag.findOne({name : req.query.name}, (err, tag)=>{
                if(tag){
                    res.send(tag)
                }
                else{
                    res.send({name : req.query.name})
                }
            })
        }
        else{
            Tag.find({}, (err, tags)=>{
                res.send(tags);
            })
        }
    }

    public delete (req:Request, res:Response){
        super.delete(req, res)
    }

}

export = new Tags();