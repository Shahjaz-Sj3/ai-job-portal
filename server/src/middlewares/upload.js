const path = require('path');
const multer = require('multer');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const storage = multer.diskStorage({
  destination: env.uploadDir,
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '-');
    cb(null, `${req.user._id}-${Date.now()}-${safeName}`);
  },
});

const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf';
    cb(isPdf ? null : new ApiError(400, 'Only PDF resumes are allowed'), isPdf);
  },
});

module.exports = uploadResume;
