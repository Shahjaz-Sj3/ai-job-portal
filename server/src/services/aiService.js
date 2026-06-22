const Groq = require('groq-sdk');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const client = env.groqApiKey ? new Groq({ apiKey: env.groqApiKey }) : null;

const parseJson = (content, fallback) => {
  try {
    const cleaned = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    return fallback;
  }
};

const callGroqJson = async (system, user, fallback) => {
  if (!client) {
    throw new ApiError(503, 'GROQ_API_KEY is not configured');
  }

  let response;

  try {
    response = await client.chat.completions.create(
      {
        model: env.groqModel,
        temperature: 0.2,
        messages: [
          { role: 'system', content: `${system} Return valid JSON only.` },
          { role: 'user', content: user },
        ],
      },
      { timeout: env.groqTimeoutMs },
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'APIConnectionTimeoutError') {
      throw new ApiError(504, 'Groq AI request timed out. Please try again.');
    }
    throw new ApiError(502, error.message || 'Groq AI request failed');
  }

  return parseJson(response.choices[0]?.message?.content || '', fallback);
};

const extractResumeProfile = async (resumeText) => {
  const fallback = { skills: [], education: [], experience: [], certifications: [], summary: '' };
  return callGroqJson(
    'You extract structured resume data for a recruiting platform.',
    `Extract skills, education, experience, certifications, and a one sentence summary from this resume:\n\n${resumeText.slice(0, 12000)}`,
    fallback,
  );
};

const calculateMatch = async (resumeProfile, job) => {
  const fallback = { matchScore: 0, missingSkills: [], strengths: [] };
  return callGroqJson(
    'You compare candidate resumes against job requirements and produce objective matching data.',
    `Resume profile:\n${JSON.stringify(resumeProfile)}\n\nJob:\n${JSON.stringify({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
    })}\n\nReturn JSON with matchScore number 0-100, missingSkills array, and strengths array.`,
    fallback,
  );
};

const generateInterviewQuestions = async (job, count = 5) => {
  const fallback = { questions: [] };
  return callGroqJson(
    'You generate concise technical interview questions for recruiters.',
    `Generate ${count} interview questions for this role:\n${JSON.stringify({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
    })}\nReturn JSON with a questions array of strings.`,
    fallback,
  );
};

const generateResumeSuggestions = async (resumeProfile, resumeText) => {
  const fallback = { suggestions: [] };
  return callGroqJson(
    'You give practical resume improvement suggestions for software job candidates.',
    `Resume profile:\n${JSON.stringify(resumeProfile)}\n\nResume text:\n${resumeText.slice(0, 12000)}\nReturn JSON with suggestions array of short strings.`,
    fallback,
  );
};

module.exports = {
  calculateMatch,
  extractResumeProfile,
  generateInterviewQuestions,
  generateResumeSuggestions,
};
