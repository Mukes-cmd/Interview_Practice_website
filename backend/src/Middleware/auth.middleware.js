const jwt = require('jsonwebtoken')
const blacklistToken = require("../models/blacklist.model")




async function authUser(req, res, next){
    const token = req.cookies.token


    if(!token){
        return res.status(401).json({
            message : "Token not provided"
        })
    }


    const istokenBlacklist = await blacklistToken.findOne({token})
    if(istokenBlacklist){
        return res.status(401).json({
            message : "Invalid token "
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user =  decoded
        next()

    }catch(err){
         return res.status(401).json({
            message : "Invalid token."
         })
    }
}


module.exports = {authUser}


 