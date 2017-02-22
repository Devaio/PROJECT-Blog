import {Document, Schema, Model, model, Types} from 'mongoose';
import {post} from '../interfaces/post';

// add mongoose Document to interface
interface PostModel extends post, Document{}

var CommentSchema: Schema = new Schema({
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



export const Account: Model<PostModel> = model<PostModel>("Comment", CommentSchema);

















	// title : String,
	// slug : String	,
	// coverImg : String,
	// pinImg : String,
	// preview : String,
	// content : String,
	// tags : [{type : Schema.ObjectId, ref : "Tag"}],
	// createdAt : String,
	// deleted : {type : Boolean, default : false},
	// comments : [{type : Schema.ObjectId, ref : "Comment"}],