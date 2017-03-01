import crypto = require('crypto');

class Password {
    public encrypt (password: string){
        return crypto.createHash('sha512').update(password).digest('hex');
    }

    public compare (password : string, userPassword: string, cb: Function){
        

        cb(this.encrypt(password) === userPassword ? true : false);
    }
}

export = new Password()