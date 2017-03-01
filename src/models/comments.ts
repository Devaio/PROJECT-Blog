import {Document, Schema, Model, model, Types} from 'mongoose';
import {comment} from '../interfaces/comment';

// add mongoose Document to interface
interface CommentModel extends comment, Document{}

var CommentSchema: Schema = new Schema({
    name : String,
	email : String,
	website : String,
	content : String,
	approved : {type : Boolean, default : false},
	createdAt : String,
	deleted : {type : Boolean, default : false},
	post : {type : Schema.Types.ObjectId, ref : 'Post'},
	
	isSubComment : {type : Boolean, default : false},
	subComments : [{type : Schema.Types.ObjectId, ref : 'Comment'}],
	sendEmail : {type : Boolean, default : false}
});



export const Comment: Model<CommentModel> = model<CommentModel>("Comment", CommentSchema);
