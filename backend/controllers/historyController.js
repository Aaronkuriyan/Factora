const Analysis = require('../models/Analysis');

// @desc    Get user's analysis history
// @route   GET /api/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, saved } = req.query;
    const skip = (page - 1) * limit;

    let filter = { userId: req.user.id };

    // Add category filter if provided
    if (category) {
      filter.category = category;
    }

    // Add saved filter if provided
    if (saved === 'true') {
      filter.isSaved = true;
    } else if (saved === 'false') {
      filter.isSaved = false;
    }

    const analyses = await Analysis.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Analysis.countDocuments(filter);

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

// @desc    Get history statistics
// @route   GET /api/history/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total analyses
    const totalAnalyses = await Analysis.countDocuments({ userId });

    // Get category breakdown
    const categoryStats = await Analysis.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Get average credibility score
    const avgScore = await Analysis.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: null, avgCredibility: { $avg: '$credibilityScore' } } },
    ]);

    // Get saved analyses count
    const savedCount = await Analysis.countDocuments({ userId, isSaved: true });

    // Get analyses from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentAnalyses = await Analysis.countDocuments({
      userId,
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      success: true,
      stats: {
        totalAnalyses,
        savedAnalyses: savedCount,
        recentAnalyses,
        averageCredibilityScore: avgScore[0]?.avgCredibility || 0,
        categoryBreakdown: categoryStats.reduce(
          (acc, item) => ({ ...acc, [item._id]: item.count }),
          {}
        ),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete all history for user
// @route   DELETE /api/history
// @access  Private
exports.deleteAllHistory = async (req, res) => {
  try {
    const result = await Analysis.deleteMany({ userId: req.user.id });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} analyses from history`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get analyses by date range
// @route   GET /api/history/range
// @access  Private
exports.getAnalysesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Please provide startDate and endDate' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const analyses = await Analysis.find({
      userId: req.user.id,
      createdAt: { $gte: start, $lte: end },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: analyses,
      count: analyses.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Export history as JSON
// @route   GET /api/history/export
// @access  Private
exports.exportHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    const exportData = {
      exportedAt: new Date(),
      totalAnalyses: analyses.length,
      analyses,
    };

    res.json({
      success: true,
      data: exportData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
