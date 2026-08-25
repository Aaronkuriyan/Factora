const express = require('express');
const router = express.Router();
const {
  analyzeArticle,
  getAnalysis,
  getUserAnalyses,
  deleteAnalysis,
  toggleSaveAnalysis,
  addTags,
} = require('../controllers/analyzeController');
const { protect } = require('../middleware/auth');
const { validateAnalysisInput } = require('../middleware/validation');

// All routes are protected
router.use(protect);

// Analysis routes
router.post('/', validateAnalysisInput, analyzeArticle);
router.get('/', getUserAnalyses);
router.get('/:id', getAnalysis);
router.delete('/:id', deleteAnalysis);
router.patch('/:id/save', toggleSaveAnalysis);
router.patch('/:id/tags', addTags);

module.exports = router;
