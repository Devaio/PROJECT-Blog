import {Document, Schema, Model, model, Types} from 'mongoose';
import {tag} from '../interfaces/tag';

// add mongoose Document to interface
interface TagModel extends tag, Document{}

var TagSchema: Schema = new Schema({
    name : String,
});



export const Tag: Model<TagModel> = model<TagModel>("Tag", TagSchema);
