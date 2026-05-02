const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/me', protect, getUserProfile);
router.put('/me', protect, updateProfile);

module.exports = router;
