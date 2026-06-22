const Application = require('../models/Application');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { calculateMatch } = require('./aiService');
const ApiError = require('../utils/ApiError');

const applyToJob = async (user, { jobId, coverLetter }) => {
  const job = await Job.findById(jobId).lean();
  if (!job || job.status !== 'active') throw new ApiError(404, 'Active job not found');

  const resume = await Resume.findOne({ user: user._id }).lean();
  if (!resume) throw new ApiError(400, 'Upload a resume before applying');

  const aiMatch = await calculateMatch(resume.parsedProfile, job);

  try {
    return await Application.create({
      applicant: user._id,
      job: job._id,
      resume: resume._id,
      coverLetter,
      matchScore: Math.max(0, Math.min(100, Number(aiMatch.matchScore) || 0)),
      missingSkills: Array.isArray(aiMatch.missingSkills) ? aiMatch.missingSkills : [],
    });
  } catch (error) {
    if (error.code === 11000) throw new ApiError(409, 'You already applied to this job');
    throw error;
  }
};

const listUserApplications = (userId) =>
  Application.find({ applicant: userId })
    .populate('job', 'title company location type status')
    .sort({ createdAt: -1 })
    .lean();

const listRecruiterApplicants = async (recruiterId) => {
  const jobs = await Job.find({ recruiter: recruiterId }).select('_id').lean();
  return Application.find({ job: { $in: jobs.map((job) => job._id) } })
    .populate('applicant', 'name email')
    .populate('job', 'title company')
    .populate('resume', 'parsedProfile originalName')
    .sort({ createdAt: -1 })
    .lean();
};

const updateApplicationStatus = async (applicationId, status, user) => {
  const application = await Application.findById(applicationId).populate('job');
  if (!application) throw new ApiError(404, 'Application not found');

  const isOwnerRecruiter = String(application.job.recruiter) === String(user._id);
  if (user.role !== 'admin' && !isOwnerRecruiter) {
    throw new ApiError(403, 'You can only manage applicants for your own jobs');
  }

  application.status = status;
  await application.save();
  return application.populate([{ path: 'applicant', select: 'name email' }, { path: 'job', select: 'title company' }]);
};

module.exports = {
  applyToJob,
  listRecruiterApplicants,
  listUserApplications,
  updateApplicationStatus,
};
