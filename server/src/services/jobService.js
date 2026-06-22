const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');

const listJobs = async (query = {}, user = null) => {
  const filter = {};
  if (query.search) filter.$text = { $search: query.search };
  if (query.status) filter.status = query.status;
  if (!user || user.role === 'user') filter.status = 'active';
  if (user?.role === 'recruiter' && (query.mine === 'true' || query.mine === undefined)) filter.recruiter = user._id;

  return Job.find(filter).populate('recruiter', 'name email company').sort({ createdAt: -1 }).lean();
};

const getJob = async (id) => {
  const job = await Job.findById(id).populate('recruiter', 'name email company').lean();
  if (!job) throw new ApiError(404, 'Job not found');
  return job;
};

const createJob = (payload, recruiter) => Job.create({ ...payload, recruiter: recruiter._id });

const updateJob = async (id, payload, user) => {
  const job = await Job.findById(id);
  if (!job) throw new ApiError(404, 'Job not found');
  if (user.role !== 'admin' && String(job.recruiter) !== String(user._id)) {
    throw new ApiError(403, 'You can only manage your own job listings');
  }

  Object.assign(job, payload);
  await job.save();
  return job;
};

const deleteJob = async (id, user) => {
  const job = await Job.findById(id);
  if (!job) throw new ApiError(404, 'Job not found');
  if (user.role !== 'admin' && String(job.recruiter) !== String(user._id)) {
    throw new ApiError(403, 'You can only delete your own job listings');
  }

  await job.deleteOne();
};

module.exports = { createJob, deleteJob, getJob, listJobs, updateJob };
