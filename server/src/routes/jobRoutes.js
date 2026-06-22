const express = require('express');
const jobController = require('../controllers/jobController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { jobSchemas } = require('../utils/validators');

const router = express.Router();

router.get('/', jobController.listJobs);
router.get('/recruiter/mine', authenticate, authorize('recruiter', 'admin'), jobController.listJobs);
router.get('/:id', validate(jobSchemas.id), jobController.getJob);
router.post('/', authenticate, authorize('recruiter', 'admin'), validate(jobSchemas.create), jobController.createJob);
router.patch('/:id', authenticate, authorize('recruiter', 'admin'), validate(jobSchemas.update), jobController.updateJob);
router.delete('/:id', authenticate, authorize('recruiter', 'admin'), validate(jobSchemas.id), jobController.deleteJob);

module.exports = router;
