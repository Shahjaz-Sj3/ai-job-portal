const applicationService = require('../services/applicationService');
const asyncHandler = require('../utils/asyncHandler');

const apply = asyncHandler(async (req, res) => {
  const application = await applicationService.applyToJob(req.user, req.validated.body);
  res.status(201).json({ success: true, data: application });
});

const myApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.listUserApplications(req.user._id);
  res.json({ success: true, data: applications });
});

const applicants = asyncHandler(async (req, res) => {
  const applications = await applicationService.listRecruiterApplicants(req.user._id);
  res.json({ success: true, data: applications });
});

const updateStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationStatus(
    req.params.id,
    req.validated.body.status,
    req.user,
  );
  res.json({ success: true, data: application });
});

module.exports = { applicants, apply, myApplications, updateStatus };
