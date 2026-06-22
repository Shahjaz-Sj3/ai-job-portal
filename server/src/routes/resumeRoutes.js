const express = require('express');
const resumeController = require('../controllers/resumeController');
const { authenticate, authorize } = require('../middlewares/auth');
const uploadResume = require('../middlewares/upload');

const router = express.Router();

router.get('/me', authenticate, authorize('user'), resumeController.getMyResume);
router.post('/upload', authenticate, authorize('user'), uploadResume.single('resume'), resumeController.uploadResume);
router.get('/suggestions', authenticate, authorize('user'), resumeController.getSuggestions);

module.exports = router;
