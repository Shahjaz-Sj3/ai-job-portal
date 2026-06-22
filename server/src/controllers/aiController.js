const Job = require('../models/Job');
const Resume = require('../models/Resume');
const aiService = require('../services/aiService');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const matchJob = asyncHandler(async (req, res) => {
  const [job, resume] = await Promise.all([
    Job.findById(req.params.jobId).lean(),
    Resume.findOne({ user: req.user._id }).lean(),
  ]);

  if (!job) throw new ApiError(404, 'Job not found');
  if (!resume) throw new ApiError(400, 'Upload a resume before requesting a match score');

  const match = await aiService.calculateMatch(resume.parsedProfile, job);
  res.json({ success: true, data: match });
});

const interviewQuestions = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.validated.body.jobId).lean();
  if (!job) throw new ApiError(404, 'Job not found');

  const result = await aiService.generateInterviewQuestions(job, req.validated.body.count);
  res.json({ success: true, data: result });
});

module.exports = { interviewQuestions, matchJob };
