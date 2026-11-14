const express = require("express");
const app = express();
const cookies = require("cookie-parser")
const cors = require('cors')

app.use(express.json());
app.use(cookies())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))



const authRoutes = require("./router/authRoutes.js")
const interviewRoutes = require("./router/interview.routes.js")
app.use("/api/auth", authRoutes)
app.use("/api/interview", interviewRoutes)


module.exports = app;

