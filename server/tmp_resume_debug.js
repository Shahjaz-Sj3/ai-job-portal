const path = require('path');
const { uploadResume } = require('./src/services/resumeService');

(async () => {
  try {
    const file = {
      path: path.join(__dirname, 'uploads/resumes/6a33e764383f9f5b8e6be522-1781786943971-resume.pdf'),
      originalname: 'resume.pdf',
    };
    const user = { _id: '000000000000000000000000' };
    const resume = await uploadResume(user, file);
    console.log('RESUME UPLOAD RESULT:', JSON.stringify(resume, null, 2));
  } catch (error) {
    console.error('ERROR NAME:', error.name);
    console.error('STATUS CODE:', error.statusCode);
    console.error('MESSAGE:', error.message);
    console.error('DETAILS:', error.details);
    console.error('STACK:', error.stack);
    process.exit(1);
  }
})();
