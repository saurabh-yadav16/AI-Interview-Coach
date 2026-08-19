const express = require('express');
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  getNextQuestion,
  evaluateInterview,
  getInterviewById,
  getInterviewHistory,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startInterview);
router.post('/:id/answer', protect, submitAnswer);
router.post('/:id/next-question', protect, getNextQuestion);
router.post('/:id/evaluate', protect, evaluateInterview);
router.get('/history', protect, getInterviewHistory);
router.get('/:id', protect, getInterviewById);

module.exports = router;
