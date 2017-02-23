import async = require('async');
import moment = require('moment');
import s3 = require('s3');
import { NextFunction, Request, Response } from "express";


if(global.process.env.AMAZON_KEY){
    var s3Client = s3.createClient({
        s3Options : {
            accessKeyId : global.process.env.AMAZON_KEY,
            secretAccessKey : global.process.env.AMAZON_SECRET
        }
    })    
}

class Media {
    constructor(){

    }

    public uploadFiles(req: Request, res: Response){
        let files = req.files.files;
    }
}