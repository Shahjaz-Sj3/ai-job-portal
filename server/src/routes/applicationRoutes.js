const express = require('express');
const applicationController = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { applicationSchemas } = require('../utils/validators');

const router = express.Router();

router.post('/', authenticate, authorize('user'), validate(applicationSchemas.apply), applicationController.apply);
router.get('/me', authenticate, authorize('user'), applicationController.myApplications);
router.get('/applicants', authenticate, authorize('recruiter', 'admin'), applicationController.applicants);
router.patch(
  '/:id/status',
  authenticate,
  authorize('recruiter', 'admin'),
  validate(applicationSchemas.status),
  applicationController.updateStatus,
);

module.exports = router;
