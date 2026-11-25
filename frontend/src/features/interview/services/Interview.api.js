import axios from "axios"

const api = axios.create({
  baseURL: "",
  withCredentials: true,
})

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
  const formData = new FormData()
  formData.append("jobDescription", jobDescription)
  formData.append("selfDescription", selfDescription)
  if (resumeFile) formData.append("resume", resumeFile) // don't send "undefined" as a string


  const response = await api.post("/api/interview/", formData)
  return response.data
}

export const getInterviewReportByid = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`)
  return response.data
}

export const getallReport = async () => {
  const response = await api.get("/api/interview/")
  return response.data
}


export const generateResumepdf = async({interviewId})=>{
  const response = await api.post(`/api/interview/resume/pdf/${interviewId}`, null, {
    responseType:"blob"
  })
  return response.data
 
}


