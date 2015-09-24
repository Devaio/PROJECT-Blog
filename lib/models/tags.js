var Schema, mongoose, tags;

mongoose = require('mongoose');

Schema = mongoose.Schema;

tags = new Schema({
  name: String
});

mongoose.model('Tag', tags);
