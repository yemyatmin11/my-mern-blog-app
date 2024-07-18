const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    name : {
        type : String,
        required : true
    },
    photo : {
        type : String
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    }
})

UserSchema.statics.register = async function(name,email,password) {
    let userExists = await this.findOne({email});

    if(userExists) {
        throw new Error('user already exists');
    }

    const salt = await bcryptjs.genSalt();
    const hashedValue = await bcryptjs.hash(password, salt);

    let user = await this.create( {
        name,
        email,
        password : hashedValue
    });

    return user;
}

UserSchema.statics.login = async function(email,password) {
    let user = await this.findOne({email});

    if(!user) {
        throw new Error('user does not exists');
    };

    let isCorrect = await bcryptjs.compare(password, user.password);

    if(isCorrect) {
        return user;
    }
    else {
        throw new Error('Incorrect Password!')
    }
}

module.exports = mongoose.model('User', UserSchema)