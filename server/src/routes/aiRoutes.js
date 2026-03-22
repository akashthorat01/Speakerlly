const express = require('express');
const router = express.Router();
const { processChat } = require('../controllers/aiController');

router.post('/chat', processChat);

module.exports = router;
