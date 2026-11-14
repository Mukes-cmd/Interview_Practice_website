const express = require('express')
const interviewRouter = express.Router()
const authUserMiddleware = require("../Middleware/auth.middleware")
const {generateReportControlller, getReportByid, getallReport, generateResumepdfController} = require("../controllers/generateReport.controller.js")
const upload = require("../Middleware/file.middleware.js")




interviewRouter.post("/", authUserMiddleware.authUser, upload.single("resume"), generateReportControlller);
interviewRouter.get("/report/:interviewId", authUserMiddleware.authUser, getReportByid)
interviewRouter.get("/", authUserMiddleware.authUser, getallReport)
interviewRouter.post("/resume/pdf/:interviewId", authUserMiddleware.authUser, generateResumepdfController)



module.exports = interviewRouter