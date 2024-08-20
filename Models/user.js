const { required } = require("joi");
const mongoose  = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        match: /^[a-zA-Z0-9._%+-]+@gmail+\.com+/
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

