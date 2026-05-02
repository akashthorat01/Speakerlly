const express = require('express');
const router = express.Router();
const { getTrainers, addTrainer } = require('../controllers/trainerController');

router.get('/', getTrainers);
router.post('/', addTrainer);

module.exports = router;
