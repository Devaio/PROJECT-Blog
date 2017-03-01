import {Types} from 'mongoose';

export interface post {
    title? : string,
	slug? : string,	
	coverImg? : string,
	pinImg? : string,
	preview? : string,
	content? : string,
	tags? : Array<Types.ObjectId>
	createdAt? : string,
	deleted? : boolean
	comments? : Array<Types.ObjectId>

}

