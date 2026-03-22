const express = require('express');
const router = express.Router();
const { bookSession, getUserSessions, getTrainerSessions, updateSessionStatus } = require('../controllers/sessionController');

router.post('/book', bookSession);
router.get('/my-sessions', getUserSessions);
router.get('/trainer-sessions', getTrainerSessions);
router.put('/:sessionId/status', updateSessionStatus);

module.exports = router;
