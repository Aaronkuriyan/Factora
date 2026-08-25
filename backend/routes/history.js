const express = require('express');
const router = express.Router();
const {
  getHistory,
  getStats,
  deleteAllHistory,
  getAnalysesByDateRange,
  exportHistory,
} = require('../controllers/historyController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// History routes
router.get('/', getHistory);
router.get('/stats', getStats);
router.get('/range', getAnalysesByDateRange);
router.get('/export', exportHistory);
router.delete('/', deleteAllHistory);

module.exports = router;
