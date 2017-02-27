import async = require('async');
import moment = require('moment');
import s3 = require('s3');
import { NextFunction, Request, Response } from "express";


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

    private fileUploader(file) {
        let filename: string = moment().format('X') + file.name;
        let headers: Object = {
            'Content-Type': file.type,
            'x-amz-acl': 'public-read'
        }

        let uploader = s3Client.uploadFile({
            localfile: file.path,
            s3Params: {
                Bucket: global.process.env.AMAZON_BUCKET,
                Key: filename,
                ACL: 'public-read'
            }
        })

        return new Promise<string>((resolve) => {

            uploader.on('end', () => {
                let url = s3.getPublicUrlHttp(global.process.env.AMAZON_BUCKET, filename)
                file.url = url;

                resolve('ok')
            })
        })



    }

    public async uploadFiles(req: Request, res: Response) {
        let files: Array<Object> = req['files'].files;
        let tasks: Array<Function> = [];

        for (let file of files) {

            await this.fileUploader(file);

        }
        res.send({data : files});

    }
}