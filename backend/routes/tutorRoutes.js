const express = require('express');
const router = express.Router();
const { askTutor, getSuggestions } = require('../controllers/tutorController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', protect, askTutor);
router.get('/suggestions', protect, getSuggestions);

module.exports = router;
