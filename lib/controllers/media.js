var async, moment, s3, s3Client;

async = require('async');

moment = require('moment');

if (global.process.env.AMAZON_KEY) {
  s3 = require('s3');
  s3Client = s3.createClient({
    s3Options: {
      accessKeyId: global.process.env.AMAZON_KEY,
      secretAccessKey: global.process.env.AMAZON_SECRET
    }
  });
}

module.exports = {
  uploadFiles: function(req, res) {
    var file, files, tasks, _fn, _i, _len;
    console.log('upload!', req.files.files);
    files = req.files.files;
    tasks = [];
    _fn = function(file) {
      return tasks.push(function(cb) {
        var filename, headers, uploader;
        filename = moment().format('X') + file.name;
        headers = {
          'Content-Type': file.type,
          'x-amz-acl': 'public-read'
        };
        uploader = s3Client.uploadFile({
          localFile: file.path,
          s3Params: {
            Bucket: global.process.env.AMAZON_BUCKET,
            Key: filename,
            ACL: 'public-read'
          }
        });
        uploader.on('progress', function() {
          return console.log("progress", uploader.progressAmount, uploader.progressTotal);
        });
        return uploader.on('end', function() {
          var url;
          url = s3.getPublicUrlHttp(global.process.env.AMAZON_BUCKET, filename);
          console.log('URL', url);
          file.url = url;
          return cb();
        });
      });
    };
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      _fn(file);
    }
    return async.series(tasks, function() {
      return res.send({
        data: files
      });
    });
  }
};
