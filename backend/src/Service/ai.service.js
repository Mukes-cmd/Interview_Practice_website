const z = require("zod");
const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

const questionShape = {
  question: z.string().describe("The question that can be asked in the interview"),
  intention: z.string().describe("The intention of the interviewer behind asking this question"),
  answer: z.string().describe("How to answer this question, what points to cover, what approach to take"),
};

const interviewReportSchema = z.object({
  title: z.string().describe("The title of the job for which the interview report is generated"),

  matchScore: z.number().min(0).max(100),

  technicalQuestion: z.array(z.object(questionShape)),

  behavioralQuestion: z.array(z.object(questionShape)),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
});

const MODELS = ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.6-flash"];
const RETRIES_PER_MODEL = 2;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isRetryable = (err) => err?.status === 503 || err?.status === 429;

async function invokeGemini({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate an interview report for a candidate with the following details:
Resume: ${resume}
Self description: ${selfDescription}
Job description: ${jobDescription}

Score matchScore from 0-100 based on how closely the candidate fits the job. Be realistic, not generous.`;

  const jsonSchema = z.toJSONSchema(interviewReportSchema);
  let lastError;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < RETRIES_PER_MODEL; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseJsonSchema: jsonSchema,
          },
        });
        return JSON.parse(response.text);
      } catch (err) {
        lastError = err;
        if (!isRetryable(err)) throw err;
        console.warn(`${model} failed (${err.status}), attempt ${attempt + 1}`);
        await sleep(1000 * 2 ** attempt); // 1s, 2s
      }
    }
  }

  throw lastError;
}

async function generatePdfFromhtml(htmlContent) {
  const browser = await puppeteer.launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    return await page.pdf({ format: "A4", printBackground: true });
  } finally {
    await browser.close();
  }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfschema = z.object({
    html: z.string().describe("The HTML content of the resume which can be converted to pdf using puppeteer"),
  });

  const prompt = `You are an expert professional resume writer and ATS optimization specialist.

Generate a professional, modern, and ATS-friendly HTML resume for the candidate using the following information:

EXISTING RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

TARGET JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:

1. Analyze all the provided information carefully.
2. Create a professional resume tailored specifically to the target job description.
3. Highlight relevant technical skills, projects, education, experience, and achievements.
4. Use professional language, strong action verbs, and concise bullet points.
5. Include relevant ATS keywords from the job description naturally.
6. Maintain factual accuracy. Never invent skills, experience, internships, certifications, projects, companies, or achievements.
7. Do not assume missing information. Omit unavailable details.
8. Convert the self-description into a professional summary instead of copying it word for word.
9. Prioritize the most relevant information for the target position.

RESUME SECTIONS (include only when information is available):

- Professional Summary
- Technical Skills
- Work Experience
- Internships
- Projects
- Education
- Certifications
- Achievements

HTML AND CSS DESIGN REQUIREMENTS:

1. Generate a complete HTML5 document.
2. Create a modern, clean, and professional resume design.
3. Use a professional color combination of navy blue, white, and subtle grey.
4. Use proper typography, spacing, alignment, and section headings.
5. Make the resume suitable for A4 paper size.
6. Keep the resume within 1-2 pages wherever possible.
7. Write all CSS inside the HTML <style> tag.
8. Include print-specific CSS using @page and @media print.
9. Do not use external CSS, JavaScript, images, libraries, or frameworks.
10. Ensure the HTML works directly with Puppeteer for PDF generation.
11. Make the resume readable, well-structured, and ATS-friendly.
12. Avoid unnecessary graphics, tables, icons, and decorative elements.

STRICT OUTPUT FORMAT:

Return ONLY a valid JSON object with exactly one property named "html".

Expected structure:
{
  "html": "<!DOCTYPE html><html>...</html>"
}

IMPORTANT:

- The html property must contain the complete HTML document.
- Return valid JSON with properly escaped quotation marks and special characters.
- Do not include Markdown code blocks.
- Do not include explanations or additional text.
- Do not return any other JSON properties.
- Never fabricate candidate information.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(resumePdfschema),
    },
  });

  const jsonContent = JSON.parse(response.text);
  return await generatePdfFromhtml(jsonContent.html);
}

module.exports = { invokeGemini, generateResumePdf };
