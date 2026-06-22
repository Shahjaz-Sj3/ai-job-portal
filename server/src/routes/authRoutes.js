const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { authSchemas } = require('../utils/validators');

const router = express.Router();

router.post('/register', validate(authSchemas.register), authController.register);
router.post('/login', validate(authSchemas.login), authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;
