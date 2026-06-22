const dotenv = require('dotenv');

dotenv.config();

const env = {
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5174',
  adminInviteCode: process.env.ADMIN_INVITE_CODE || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-me',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_job_portal',
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  groqTimeoutMs: Number(process.env.GROQ_TIMEOUT_MS || 30000),
  port: Number(process.env.PORT || 5001),
  uploadDir: process.env.UPLOAD_DIR || 'uploads/resumes',
};

module.exports = env;
