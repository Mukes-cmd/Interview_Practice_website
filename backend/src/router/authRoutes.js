const express = require("express");
const authRoutes = express.Router()
const {userRegister, userLogin, logout, getme} = require("../controllers/authControllers.js")
const authMiddleware = require("../Middleware/auth.middleware.js")



// /api/auth/register
authRoutes.post("/register", userRegister)

// /api/auth/login
authRoutes.post("/login", userLogin)

// /api/auth/logout
authRoutes.get('/logout', logout)

//   /api/auth/get-me

authRoutes.get('/get-me', authMiddleware.authUser, getme)





module.exports = authRoutes