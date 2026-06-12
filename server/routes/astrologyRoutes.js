const express = require('express');
const router = express.Router();
const {
  generateRecommendation,
  getUserHistory,
  getReportDetails
} = require('../controllers/astrologyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recommend', generateRecommendation);
router.get('/history', protect, getUserHistory);
router.get('/report/:id', getReportDetails);

module.exports = router;
