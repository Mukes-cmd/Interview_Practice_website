const mongoose = require('mongoose')

const BlacklistToken = new mongoose.Schema({
      token :{
        type: String,
        required : [true, "token is required to be added in blacklist"]
      }
},
  {
    timestamps : true
  }
)



const BlacklisttokenSchema = mongoose.model("blacklistToken", BlacklistToken)

module.exports = BlacklisttokenSchema