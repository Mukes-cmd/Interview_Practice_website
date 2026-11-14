const userModel = require("../models/User.model")
const BlacklistToken = require('../models/blacklist.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')



async function userRegister(req, res){
    const {username, email, password} = req.body;
   if(!username || !email || !password){
      return res.status(400).json({
        message : "Provide usename, emai and password"
      })
   }

    try{
        const userExist = await userModel.findOne({
            $or : [{username}, {email}]
        });

        
        if(userExist){
            return res.status(400).json({
                message: 'User already exist'
            })
        }


        const hashpassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password : hashpassword
        })


        const token = jwt.sign(
            {id: user._id, username : user.username},
            process.env.JWT_SECRET,
            {expiresIn : "id"}
        )

        res.cookie("token", token)

        res.status(201).json({
            message : "User Register successfully",
            user : {
                id : user._id,
                username : user.username,
                email : user.email
            }
        })
      


    }catch(error){
        return res.status(404)({
            message : "User not found"
        })
    }
}






async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Provide email and password" });
    }

    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({
      message: "User login successfully",
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}


// blacklist token => it contains those token user logout which if another user stolen that token it could not take adavnvtage because that is blacklist 

async function logout(req, res){
    const token = req.cookies.token
    if(token){
        await BlacklistToken.create({token})
    }


    res.clearCookie("token")
    res.status(200).json({
        message : "User logout successfully"
    })
}

// this function help to get detailed of user   
async function getme(req, res){
      const user = await userModel.findById(req.user.id)
      res.status(200).json({
        message : "user details fetched successfully",
        user : {
            id :  user.id,
            username : user.username,
            email :  user.email
        }
      })
}


module.exports = {userRegister, userLogin, logout, getme}