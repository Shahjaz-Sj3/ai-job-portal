const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'], default: 'Full-time' },
    description: { type: String, required: true, trim: true },
    requirements: [{ type: String, trim: true }],
    salaryRange: { type: String, trim: true, maxlength: 80 },
    status: { type: String, enum: ['active', 'paused', 'closed'], default: 'active', index: true },
  },
  { timestamps: true },
);

jobSchema.index({ title: 'text', company: 'text', location: 'text', requirements: 'text' });

module.exports = mongoose.model('Job', jobSchema);
