import async = require('async');
import moment = require('moment');
import s3 = require('s3');
import { NextFunction, Request, Response } from "express";
import fs = require('fs');


if (global.process.env.AMAZON_KEY) {
    var s3Client = s3.createClient({
        s3Options: {
            accessKeyId: global.process.env.AMAZON_KEY,
            secretAccessKey: global.process.env.AMAZON_SECRET
        }
    })
}

class Media {
    constructor() {

    }

    private static fileUploader(req, file) {
        console.log('FILE UPLOADER')
        let url: string = `/public/img/${moment().format('X')}${file.name}`;
        console.log('!!!', url)
        
        return new Promise<string>((resolve) => {
            console.log('!!!')
            fs.readFile(file.path, (err, data) => {
                console.log('READ')
                fs.writeFile(`.${url}`, data, (err) => {
                    console.log('WRITE')
                    file.url = `${req.protocol}://${req.hostname}${url}`
                    resolve(file.url);
                });
            })
        })


    }

    public async uploadFiles(req: Request, res: Response) {
        let files: Array<Object> = req['files'].files;
        let tasks: Array<Function> = [];

        for (let file of files) {
            console.log('UPLOADING FILE....')
            await Media.fileUploader(req, file);

        }
        res.send({ data: files });

    }
}

export = new Media();