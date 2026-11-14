import React, {useState, useRef} from 'react'
import { useInterview } from "../Hoooks/userInterview";
import "../styles/Home.scss"
import {useNavigate} from 'react-router'

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M10 3a2 2 0 0 0-2 2v1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4V5a2 2 0 0 0-2-2h-4Zm0 2h4v1h-4V5Z" />
  </svg>


);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M19.4 10.04A7.5 7.5 0 0 0 5.1 8.6 5.5 5.5 0 0 0 6 19.5h12.5a4.5 4.5 0 0 0 .9-8.96ZM13 13v4h-2v-4H8l4-4 4 4h-3Z" />
  </svg>
);

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="m12 2 1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2Zm7 12 .9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14ZM5 15l.7 2 2 .7-2 .7L5 20.4l-.7-2-2-.7 2-.7L5 15Z" />
  </svg>
);

export default function InterviewPlanForm() {

  const {loading, generateReport, reports} = useInterview()
  const [jobDescription, setjobDescription] = useState("")
  const [selfDescription, setselfDescription] = useState("")
  const resumeInputRef = useRef()

  const navigate = useNavigate()
  
 
const handleGenerateReport = async () => {
    try {
        const resumeFile = resumeInputRef.current?.files?.[0];

       
        if (!jobDescription.trim()) {
            alert("Please enter a job description.");
            return;
        }

        if (!resumeFile && !selfDescription.trim()) {
            alert("Please upload your resume or enter your self-description.");
            return;
        }

        const data = await generateReport({
            jobDescription,
            selfDescription,
            resumeFile
        });

       
        if (!data?._id) {
            alert("Report was not generated. Please try again.");
            return;
        }

        navigate(`/interview/${data._id}`);

    } catch (error) {
        console.error("Generate Report Error:", error);

        alert(
            error.response?.data?.message ||
            "Something went wrong. Please try again later."
        );
    }
};



    if (loading) {
  return (
    <main className="loading-container">
      <div className="loader"></div>
      <h2>Please wait...</h2>
      <p>We're processing your request.</p>
    </main>
  );
}


  return (
    <div className="ipf">
      <header className="ipf__header">
        <h1 className="ipf__title">
          Create Your Custom <span className="ipf__title-accent">Interview Plan</span>
        </h1>
        <p className="ipf__subtitle">
          Let our AI analyze the job requirements and your unique profile to build a winning
          strategy.
        </p>
      </header>

      <div className="ipf__card">
        <div className="ipf__columns">
          <section className="ipf__panel">
            <div className="ipf__panel-head">
              <h2 className="ipf__panel-title">
                <span className="ipf__panel-icon"><BriefcaseIcon /></span>
                Target Job Description
              </h2>
              <span className="ipf__badge">Required</span>
            </div>

            <div className="ipf__textarea-wrap ipf__textarea-wrap--tall">
              <textarea
              onChange={(e)=> setjobDescription(e.target.value)}
                className="ipf__textarea"
                placeholder={
                  "Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                }
              />
              <span className="ipf__counter">0 / 5000 chars</span>
            </div>
          </section>

          <section className="ipf__panel ipf__panel--profile">
            <div className="ipf__panel-head">
              <h2 className="ipf__panel-title">
                <span className="ipf__panel-icon"><UserIcon /></span>
                Your Profile
              </h2>
            </div>

          <div className="ipf__field">
  <span className="ipf__label">
    Upload Resume <span className="ipf__hint">(Best Results)</span>
  </span>

  <label className="ipf__dropzone">
    <input ref={resumeInputRef} type="file" hidden  accept=".pdf,.docx" className="ipf__file-input" />
    <span className="ipf__upload-icon"><UploadIcon /></span>
    <span className="ipf__dropzone-title">Click to upload or drag &amp; drop</span>
    <span className="ipf__dropzone-meta">PDF or DOCX (Max 5MB)</span>
  </label>
</div>
            <div className="ipf__divider"><span>OR</span></div>

            <div className="ipf__field">
              <label className="ipf__label">Quick Self-Description</label>
              <div className="ipf__textarea-wrap ipf__textarea-wrap--short">
                <textarea
                onChange={(e)=>setselfDescription(e.target.value)}
                  className="ipf__textarea"
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                />
              </div>
            </div>

            <div className="ipf__info">
              <span className="ipf__info-dot" />
              <p>
                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required
                to generate a personalized plan.
              </p>
            </div>
          </section>
        </div>


        <footer className="ipf__footer">
          <span className="ipf__footer-note">AI-Powered Strategy Generation • Approx 30s</span>
          <button onClick={handleGenerateReport}
           type="button" className="ipf__submit">
            <SparkleIcon />
            Generate My Interview Strategy
          </button>
        </footer>


      </div>

        


    </div>

  );
}