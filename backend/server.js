require("dotenv").config()
const app = require("./src/app")
const connectdb = require("./src/config/Db")




connectdb()




app.listen(3000, ()=>{
    try{
        console.log("Server is connected Successfully")
    }catch(error){
        console.log("server is not connected")
    }
})