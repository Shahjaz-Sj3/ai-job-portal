const fs = require('fs/promises');
const { PDFParse } = require('pdf-parse');
const Resume = require('../models/Resume');
const { extractResumeProfile, generateResumeSuggestions } = require('./aiService');
const ApiError = require('../utils/ApiError');

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (item == null) return [];
        if (typeof item === 'string') return item.trim();
        if (typeof item === 'number' || typeof item === 'boolean') return String(item).trim();
        if (Array.isArray(item)) return item.map((sub) => (typeof sub === 'string' ? sub.trim() : JSON.stringify(sub).trim()));
        if (typeof item === 'object') {
          const parts = [];
          if (item.name) parts.push(item.name);
          if (item.title) parts.push(item.title);
          if (item.field) parts.push(item.field);
          if (item.role) parts.push(item.role);
          if (item.company) parts.push(item.company);
          if (parts.length) return parts.join(' - ');
          return JSON.stringify(item);
        }
        return '';
      })
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,\n\r]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeProfile = (profile = {}) => ({
  skills: normalizeList(profile.skills),
  education: normalizeList(profile.education),
  experience: normalizeList(profile.experience),
  certifications: normalizeList(profile.certifications),
  summary: typeof profile.summary === 'string' ? profile.summary.trim() : '',
});

const uploadResume = async (user, file) => {
  if (!file) throw new ApiError(400, 'Resume PDF is required');

  const buffer = await fs.readFile(file.path);
  let parsed;
  let parser;

  try {
    parser = new PDFParse({ data: buffer });
    parsed = await parser.getText();
  } catch (error) {
    throw new ApiError(422, 'Could not read text from this PDF. Please upload a valid text-based resume PDF.');
  } finally {
    if (parser) await parser.destroy();
  }

  const resumeText = (parsed?.text || '').trim();
  if (!resumeText) {
    throw new ApiError(422, 'No readable text found in this PDF. Please upload a text-based resume, not a scanned image.');
  }

  const profile = normalizeProfile(await extractResumeProfile(resumeText));

  try {
    return await Resume.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        originalName: file.originalname,
        filePath: file.path,
        text: resumeText,
        parsedProfile: profile,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      throw new ApiError(422, 'Could not save parsed resume data. Please upload a valid text-based resume PDF.');
    }
    throw error;
  }
};

const getResumeByUser = async (userId) => Resume.findOne({ user: userId }).lean();

const getResumeSuggestions = async (userId) => {
  const resume = await getResumeByUser(userId);
  if (!resume) throw new ApiError(404, 'Upload a resume first');
  return generateResumeSuggestions(resume.parsedProfile, resume.text);
};

module.exports = { getResumeByUser, getResumeSuggestions, uploadResume };
