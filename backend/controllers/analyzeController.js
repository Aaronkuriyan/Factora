const Analysis = require('../models/Analysis');

// Placeholder function to call ML model for analysis
// In production, this would call your Python ML server
const callMLModel = async (text, url) => {
  // TODO: Replace with actual ML model call
  // For now, return mock data
  
  const mockAnalysis = {
    credibilityScore: Math.floor(Math.random() * 100),
    category: ['reliable', 'partially_false', 'false', 'satire', 'propaganda', 'misleading'][
      Math.floor(Math.random() * 6)
    ],
    confidence: Math.random(),
    sentimentScore: (Math.random() * 2) - 1,
    detectedPatterns: ['clickbait_headline', 'emotional_language', 'unverified_claims'],
    claimsFound: ['Claim 1', 'Claim 2', 'Claim 3'],
    sourceCredibility: Math.floor(Math.random() * 100),
  };

  return mockAnalysis;
};

// @desc    Analyze article
// @route   POST /api/analyze
// @access  Private
exports.analyzeArticle = async (req, res) => {
  try {
    const { url, text, title, author, source } = req.body;
    const userId = req.user.id;

    if (!url && !text) {
      return res.status(400).json({ error: 'Please provide either URL or text' });
    }

    // Call ML model for analysis
    const mlResults = await callMLModel(text, url);

    // Create analysis record
    const analysis = await Analysis.create({
      userId,
      url,
      text: text || 'Content from URL',
      title,
      author,
      source,
      credibilityScore: mlResults.credibilityScore,
      category: mlResults.category,
      confidence: mlResults.confidence,
      sentimentScore: mlResults.sentimentScore,
      detectedPatterns: mlResults.detectedPatterns,
      claimsFound: mlResults.claimsFound,
      sourceCredibility: mlResults.sourceCredibility,
      analysisDetails: mlResults,
    });

    res.status(201).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get analysis by ID
// @route   GET /api/analyze/:id
// @access  Private
exports.getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // Check if user owns this analysis
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this analysis' });
    }

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all analyses for user
// @route   GET /api/analyze
// @access  Private
exports.getUserAnalyses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const analyses = await Analysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Analysis.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      data: analyses,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete analysis
// @route   DELETE /api/analyze/:id
// @access  Private
exports.deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // Check if user owns this analysis
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this analysis' });
    }

    await Analysis.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Analysis deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Save/Unsave analysis
// @route   PATCH /api/analyze/:id/save
// @access  Private
exports.toggleSaveAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // Check if user owns this analysis
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    analysis.isSaved = !analysis.isSaved;
    await analysis.save();

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add tags to analysis
// @route   PATCH /api/analyze/:id/tags
// @access  Private
exports.addTags = async (req, res) => {
  try {
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      return res.status(400).json({ error: 'Tags must be an array' });
    }

    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // Check if user owns this analysis
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    analysis.tags = [...new Set([...analysis.tags, ...tags])];
    await analysis.save();

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
