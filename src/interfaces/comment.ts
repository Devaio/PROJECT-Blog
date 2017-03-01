import {Types} from 'mongoose';

export interface comment {
    name? : string,
    email? : string,
	website? : string,
	content? : string,
    approved? :  boolean,
    createdAt? : string,
    deleted? : boolean,
    post? : Types.ObjectId,
    isSubComment? : boolean,
    subComments? : Array<Types.ObjectId>,
    sendEmail? : boolean

}

