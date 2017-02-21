import {Document, Schema, Model, model} from 'mongoose';
import passwords = require('../modules/passwords');
import {account} from '../interfaces/account';

// add mongoose Document to interface
interface AccountModel extends account, Document{}

var AccountSchema: Schema = new Schema({
    name : String,
	email : {type : String, required : true, unique : true},
	password : {type : String, required : true},
	role : String
});

AccountSchema.pre('save', function(next){
    if(!this.isModified('password')){
        return next();
    }

    var user = this;
    user.password = passwords.encrypt(user.password);
    return next();
});

export const User: Model<AccountModel> = model<AccountModel>("Account", AccountSchema);