const { PDFParse } = require("pdf-parse")
const { invokeGemini, generateResumePdf } = require("../Service/ai.service")
const interViewModel = require("../models/InterviewReport.model")

async function generateReportControlller(req, res) {
  try {
    const { selfDescription, jobDescription } = req.body

    if (!req.file && !selfDescription?.trim()) {
      return res.status(400).json({ message: "Resume file or self description is required" })
    }

    let resumeText = ""
    if (req.file) {
      const parser = new PDFParse({ data: req.file.buffer })
      try {
        const result = await parser.getText()
        resumeText = result.text
      } finally {
        await parser.destroy()
      }
    }

    const aiReport = await invokeGemini({
      resume: resumeText,
      selfDescription,
      jobDescription,
    })

    const interviewReport = await interViewModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      title: aiReport.title,
      matchscore: aiReport.matchScore,
      technicalQuestion: aiReport.technicalQuestion,
      behaviourQuestion: aiReport.behavioralQuestion,
      skillgaps: aiReport.skillGaps,
      plan: aiReport.preparationPlan,
    })

    return res.status(201).json({
      message: "Interview Report generated successfully",
      interviewReport,
    })
  } catch (error) {
    console.error("Generate Report Error:", error)
    const busy = error?.status === 503 || error?.status === 429
    return res.status(busy ? 503 : 500).json({
      message: busy
        ? "The AI service is busy right now. Please try again in a minute."
        : "Failed to generate interview report",
    })
  }
}

async function getReportByid(req, res) {
  try {
    const { interviewId } = req.params
    const interviewReport = await interViewModel.findOne({
      _id: interviewId,
      user: req.user.id,
    })

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" })
    }

    return res.status(200).json({
      message: "Interview report fetched successfully",
      interviewReport,
    })
  } catch (error) {
    console.error("Get Report Error:", error)
    return res.status(500).json({ message: "Failed to fetch interview report" })
  }
}

async function getallReport(req, res) {
  try {
    const interviewReports = await interViewModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -jobDescription -__v -technicalQuestion -behaviourQuestion -skillgaps -plan")

    return res.status(200).json({
      message: "Interview reports fetched successfully",
      interviewReports,
    })
  } catch (error) {
    console.error("Get All Reports Error:", error)
    return res.status(500).json({ message: "Failed to fetch interview reports" })
  }
}

async function generateResumepdfController(req, res) {
  try {
    const { interviewId } = req.params

    const interviewReport = await interViewModel.findOne({
      _id: interviewId,
      user: req.user.id,
    })

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found." })
    }

    const { resume, jobDescription, selfDescription } = interviewReport
    const pdfBuffer = await generateResumePdf({ resume, selfDescription, jobDescription })

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewId}.pdf`,
    })

    return res.send(Buffer.from(pdfBuffer))
  } catch (error) {
    console.error("Generate Resume PDF Error:", error)
    return res.status(500).json({ message: "Failed to generate resume PDF" })
  }
}

module.exports = { generateReportControlller, getReportByid, getallReport, generateResumepdfController }