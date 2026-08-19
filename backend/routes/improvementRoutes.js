const express = require('express');
const router = express.Router();
const { getImprovementPlan, toggleImprovementTask } = require('../controllers/improvementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getImprovementPlan);
router.put('/toggle-task', protect, toggleImprovementTask);

module.exports = router;
