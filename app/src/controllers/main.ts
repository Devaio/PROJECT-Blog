import helpers = require('../modules/helpers');
import { NextFunction, Request, Response } from "express";


class MainController {

    private model: any;

    constructor (model){
        this.model = model
    }

    public get (req:Request, res:Response, cb?: Function){
        
        if(req.params.id){
            this.model.findOne({_id : req.params.id}, (err, data)=>{
                res.send(data);
                cb ? cb() : null;
            });
        }

        else{
            let q = helpers.queryBuilder(req);

            this.model.find(q.query).sort(q.sortQuery).exec((err, data)=>{
                res.send(data);
                cb ? cb() : null;
            })
        }

    }

    public upsert (data: Object, req: Request, res: Response, cb?: Function){

        let self = this;

        if(req.params.id){
            let query = {_id : req.params.id};
            this.model.update(query, data, (err, data)=>{
                if(err){
                    res.send(err)
                }
                else{
                    res.send(data);
                }
                cb ? cb() : null;
            })
        }
        else{
            let newModelInstance = new this.model(data);
            newModelInstance.save((err, doc)=>{
                if(err){
                    res.send(err);
                }
                else{
                    res.send(doc)
                }
                cb ? cb() : null;
            })
        }

    }

    public delete (req: Request, res:Response, cb?:Function) {

        if(req.params.id){
            this.model.findOneAndUpdate({_id : req.params.id}, {deleted : true}, (err, data)=>{
                if(err){
                    res.send(err);
                }
                else{
                    res.send(data);
                }
                cb ? cb() : null;
            })
        }
        else{
            res.send({error : "Please provide more info"});
        }

    }

}

export = MainController;