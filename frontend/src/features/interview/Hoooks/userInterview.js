import { generateInterviewReport, getInterviewReportByid, getallReport, generateResumepdf } from "../services/Interview.api"
import { useContext } from "react"
import { InterviewContext } from "../Interview.context"

export const useInterview = () => {
  const context = useContext(InterviewContext)

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider")
  }

  const { loading, setloading, report, setreport, reports, setreports } = context

  const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setloading(true)
    try {
      const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
      setreport(response.interviewReport)
      return response.interviewReport
    } finally {
      setloading(false) // no catch: errors propagate to Home.jsx
    }
  }

  const getReportByid = async (interviewId) => {
    setloading(true)
    try {
      const response = await getInterviewReportByid(interviewId)
      setreport(response.interviewReport)
      return response.interviewReport
    } finally {
      setloading(false)
    }
  }

  const getallreport = async () => {
    setloading(true)
    
    try {
      const response = await getallReport()
      setreports(response.interviewReports) // adjust key to match your API
      return response.interviewReports
    } finally {
      setloading(false)
    }
  }
   
  const generateResumePdf = async ({ jobDescription, selfDescription, resumeFile }) => {
  setloading(true)

  try {
    const response = await generateResumepdf({
      jobDescription,
      selfDescription,
      resumeFile
    })

    return response
  } finally {
    setloading(false)
  }
}


  return { loading, report, reports, generateReport, getReportByid, getallreport, generateResumePdf }
}


