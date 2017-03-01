"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var moment = require("moment");
var s3 = require("s3");
var fs = require("fs");
if (global.process.env.AMAZON_KEY) {
    var s3Client = s3.createClient({
        s3Options: {
            accessKeyId: global.process.env.AMAZON_KEY,
            secretAccessKey: global.process.env.AMAZON_SECRET
        }
    });
}
var Media = (function () {
    function Media() {
    }
    Media.prototype.fileUploader = function (file) {
        // let filename: string = moment().format('X') + file.name;
        // let headers: Object = {
        //     'Content-Type': file.type,
        //     'x-amz-acl': 'public-read'
        // }
        // let uploader = s3Client.uploadFile({
        //     localfile: file.path,
        //     s3Params: {
        //         Bucket: global.process.env.AMAZON_BUCKET,
        //         Key: filename,
        //         ACL: 'public-read'
        //     }
        // })
        // return new Promise<string>((resolve) => {
        //     uploader.on('end', () => {
        //         let url = s3.getPublicUrlHttp(global.process.env.AMAZON_BUCKET, filename)
        //         file.url = url;
        //         resolve('ok')
        //     })
        // })
        var url = "/public/img/" + moment().format('X') + file.name;
        return new Promise(function (resolve) {
            fs.readFile(file.path, function (err, data) {
                fs.writeFile("." + url, data, function (err) {
                    file.url = "http://theviewfromhere.is" + url;
                    resolve(file.url);
                });
            });
        });
    };
    Media.prototype.uploadFiles = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var files, tasks, _i, files_1, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        files = req['files'].files;
                        tasks = [];
                        _i = 0, files_1 = files;
                        _a.label = 1;
                    case 1:
                        if (!(_i < files_1.length)) return [3 /*break*/, 4];
                        file = files_1[_i];
                        return [4 /*yield*/, this.fileUploader(file)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        res.send({ data: files });
                        return [2 /*return*/];
                }
            });
        });
    };
    return Media;
}());
module.exports = new Media();
//# sourceMappingURL=media.js.map