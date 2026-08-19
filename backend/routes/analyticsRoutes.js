const express = require('express');
const router = express.Router();
const { getAnalyticsOverview, getAdminMetrics } = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/overview', protect, getAnalyticsOverview);
router.get('/admin-metrics', protect, adminOnly, getAdminMetrics);

module.exports = router;
