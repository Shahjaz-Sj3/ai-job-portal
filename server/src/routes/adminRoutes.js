const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate, authorize('admin'));
router.get('/analytics', adminController.analytics);
router.get('/users', adminController.listUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);

module.exports = router;
