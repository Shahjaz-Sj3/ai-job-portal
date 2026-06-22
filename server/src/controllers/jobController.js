const jobService = require('../services/jobService');
const asyncHandler = require('../utils/asyncHandler');

const listJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.listJobs(req.query, req.user);
  res.json({ success: true, data: jobs });
});

const getJob = asyncHandler(async (req, res) => {
  const job = await jobService.getJob(req.params.id);
  res.json({ success: true, data: job });
});

const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.validated.body, req.user);
  res.status(201).json({ success: true, data: job });
});

const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(req.params.id, req.validated.body, req.user);
  res.json({ success: true, data: job });
});

const deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(req.params.id, req.user);
  res.status(204).send();
});

module.exports = { createJob, deleteJob, getJob, listJobs, updateJob };
