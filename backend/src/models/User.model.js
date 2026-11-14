const mongoose = require("mongoose")


const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : [true, "Username already exist choose different username"]
    },
    email : {
        type: String,
        required :  true,
        unique : [true, "Choose different email this email already exist"]
    },
    password : {
        type: String,
        required : true
    }
})



const usermodel = mongoose.model('users', UserSchema)

module.exports = usermodel