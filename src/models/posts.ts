import {Document, Schema, Model, model, Types} from 'mongoose';
import {post} from '../interfaces/post';
import moment = require('moment');

// add mongoose Document to interface
interface PostModel extends post, Document{}

var PostSchema: Schema = new Schema({
    title : String,
	slug : String,
	coverImg : String,
	pinImg : String,
	preview : String,
	content : String,
	tags : [{type : Schema.Types.ObjectId, ref : 'Tag'}],
	createdAt : String,
	deleted : {type : Boolean, default : false},
	comments : [{type : Schema.Types.ObjectId, ref : 'Comment'}]
});

PostSchema.path('createdAt').default(function(){
	return moment().format('X')

})
PostSchema.path('tags').default(function(){
	return []

})

PostSchema.index({slug : 1})

export const Post: Model<PostModel> = model<PostModel>("Post", PostSchema);
