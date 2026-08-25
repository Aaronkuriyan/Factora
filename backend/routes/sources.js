const express = require('express');
const router = express.Router();
const {
  getAllSources,
  verifySource,
  getSourcesByCategory,
  getTopSources,
  addSource,
} = require('../controllers/sourcesController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAllSources);
router.get('/top', getTopSources);
router.get('/verify/:url', verifySource);
router.get('/category/:category', getSourcesByCategory);

// Protected routes
router.post('/add', protect, addSource);

module.exports = router;
