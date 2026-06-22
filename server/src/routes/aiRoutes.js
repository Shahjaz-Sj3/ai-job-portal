const express = require('express');
const aiController = require('../controllers/aiController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { aiSchemas } = require('../utils/validators');

const router = express.Router();

router.get('/match/:jobId', authenticate, authorize('user'), validate(aiSchemas.jobId), aiController.matchJob);
router.post(
  '/interview-questions',
  authenticate,
  authorize('recruiter', 'admin'),
  validate(aiSchemas.interview),
  aiController.interviewQuestions,
);

module.exports = router;
