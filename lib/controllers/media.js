var async, fs, moment, s3, s3Client;

async = require('async');

moment = require('moment');

fs = require('fs');

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
        var url;
        console.log(file.path);
        url = '/public/img/' + moment().format('X') + file.name;
        return fs.readFile(file.path, function(err, data) {
          return fs.writeFile('.' + url, data, function(err, done) {
            console.log(done);
            file.url = 'http://theviewfromhere.is' + url;
            return cb();
          });
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
