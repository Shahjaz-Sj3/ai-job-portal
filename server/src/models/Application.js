const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    coverLetter: { type: String, trim: true, maxlength: 1500 },
    status: {
      type: String,
      enum: ['applied', 'reviewing', 'shortlisted', 'rejected', 'hired'],
      default: 'applied',
      index: true,
    },
    matchScore: { type: Number, min: 0, max: 100 },
    missingSkills: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
