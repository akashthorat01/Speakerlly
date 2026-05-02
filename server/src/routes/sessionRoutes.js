const express = require('express');
const router = express.Router();
const { bookSession, getUserSessions, getTrainerSessions, updateSessionStatus } = require('../controllers/sessionController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/book', protect, bookSession);
router.get('/my-sessions', protect, getUserSessions);
router.get('/trainer-sessions', protect, getTrainerSessions);
router.put('/:sessionId/status', protect, updateSessionStatus);

module.exports = router;
