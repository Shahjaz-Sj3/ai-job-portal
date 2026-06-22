const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    originalName: { type: String, required: true },
    filePath: { type: String, required: true },
    text: { type: String, default: '' },
    parsedProfile: {
      skills: [{ type: String, trim: true }],
      education: [{ type: String, trim: true }],
      experience: [{ type: String, trim: true }],
      certifications: [{ type: String, trim: true }],
      summary: { type: String, default: '' },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Resume', resumeSchema);
