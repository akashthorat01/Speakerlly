const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile } = require('../controllers/userController');

router.get('/me', getUserProfile);
router.put('/me', updateProfile);

module.exports = router;
