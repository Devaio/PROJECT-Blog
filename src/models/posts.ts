import {Document, Schema, Model, model, Types} from 'mongoose';
import {post} from '../interfaces/post';

// add mongoose Document to interface
interface PostModel extends post, Document{}

var PostSchema: Schema = new Schema({
    name : String,
	email : String,
	website : String,
	content : String,
	approved : {type : Boolean, default : false},
	createdAt : String,
	deleted : {type : Boolean, default : false},
	post : {type : Types.ObjectId, ref : 'Post'},
	
	isSubComment : {type : Boolean, default : false},
	subComments : [{type : Types.ObjectId, ref : 'Comment'}],
	sendEmail : {type : Boolean, default : false}
});



export const Post: Model<PostModel> = model<PostModel>("Post", PostSchema);
