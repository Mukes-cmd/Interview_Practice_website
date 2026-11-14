const mongoose = require("mongoose");

async function connectDb() {
     try{
        await mongoose.connect(process.env.MONGOOSE_URL)
        console.log("database is connected successfully")

     }catch(error){
          console.log("database is not connected successfully")
     }
}

module.exports = connectDb