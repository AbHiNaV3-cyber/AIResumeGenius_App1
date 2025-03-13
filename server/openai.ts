import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface GenerateResumeOptions {
  jobDescription?: string;
  currentResume?: string;
  careerLevel: string;
  industry: string;
}

export async function generateResume(options: GenerateResumeOptions) {
  const prompt = `Create a professional resume based on the following criteria:
Career Level: ${options.careerLevel}
Industry: ${options.industry}
${options.jobDescription ? `Job Description: ${options.jobDescription}` : ''}
${options.currentResume ? `Current Resume: ${options.currentResume}` : ''}

Please provide a JSON response that matches this schema:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string"
  },
  "summary": "string",
  "experience": [{
    "title": "string",
    "company": "string",
    "location": "string",
    "startDate": "string",
    "endDate": "string",
    "description": "string"
  }],
  "education": [{
    "degree": "string",
    "school": "string",
    "location": "string",
    "graduationDate": "string"
  }],
  "skills": ["string"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error(`Failed to generate resume: ${error.message}`);
  }
}

export async function analyzeResumeForATS(resume: string, jobDescription: string) {
  const prompt = `Analyze this resume against the job description for ATS optimization.
Resume: ${resume}
Job Description: ${jobDescription}

Provide a JSON response with:
{
  "score": number (0-100),
  "missingKeywords": [string],
  "suggestions": [string]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
}
