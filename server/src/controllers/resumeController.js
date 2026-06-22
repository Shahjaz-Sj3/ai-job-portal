const resumeService = require('../services/resumeService');
const asyncHandler = require('../utils/asyncHandler');

const uploadResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.uploadResume(req.user, req.file);
  res.status(201).json({ success: true, data: resume });
});

const getMyResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.getResumeByUser(req.user._id);
  res.json({ success: true, data: resume });
});

const getSuggestions = asyncHandler(async (req, res) => {
  const suggestions = await resumeService.getResumeSuggestions(req.user._id);
  res.json({ success: true, data: suggestions });
});

module.exports = { getMyResume, getSuggestions, uploadResume };
