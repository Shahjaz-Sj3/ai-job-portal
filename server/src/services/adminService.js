const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

const listUsers = (role) => {
  const filter = role ? { role } : {};
  return User.find(filter).select('-password').sort({ createdAt: -1 }).lean();
};

const updateUserStatus = (id, isActive) =>
  User.findByIdAndUpdate(id, { isActive }, { new: true }).select('-password').lean();

const getAnalytics = async () => {
  const [users, recruiters, jobs, applications, shortlisted] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'recruiter' }),
    Job.countDocuments(),
    Application.countDocuments(),
    Application.countDocuments({ status: 'shortlisted' }),
  ]);

  const applicationStatus = await Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

  return {
    totals: { users, recruiters, jobs, applications, shortlisted },
    applicationStatus: applicationStatus.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
  };
};

module.exports = { getAnalytics, listUsers, updateUserStatus };
