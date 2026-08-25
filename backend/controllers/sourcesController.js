// Mock credible sources database
const CREDIBLE_SOURCES = {
  'bbc.com': { credibility: 95, category: 'news', founded: 1922 },
  'reuters.com': { credibility: 94, category: 'news', founded: 1851 },
  'apnews.com': { credibility: 93, category: 'news', founded: 1846 },
  'theguardian.com': { credibility: 92, category: 'news', founded: 1821 },
  'nytimes.com': { credibility: 91, category: 'news', founded: 1851 },
  'bbc.co.uk': { credibility: 95, category: 'news', founded: 1922 },
  'washingtonpost.com': { credibility: 90, category: 'news', founded: 1877 },
  'foxnews.com': { credibility: 70, category: 'news', founded: 1996 },
  'cnn.com': { credibility: 75, category: 'news', founded: 1980 },
  'economist.com': { credibility: 88, category: 'news', founded: 1843 },
  'politico.com': { credibility: 80, category: 'political', founded: 2007 },
  'snopes.com': { credibility: 92, category: 'fact-check', founded: 1994 },
  'factcheck.org': { credibility: 94, category: 'fact-check', founded: 2003 },
  'science.org': { credibility: 96, category: 'science', founded: 1880 },
  'nature.com': { credibility: 97, category: 'science', founded: 1869 },
};

// @desc    Get all credible sources
// @route   GET /api/sources
// @access  Public
exports.getAllSources = async (req, res) => {
  try {
    const sources = Object.entries(CREDIBLE_SOURCES).map(([url, data]) => ({
      url,
      ...data,
    }));

    res.json({
      success: true,
      data: sources,
      total: sources.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Verify source credibility
// @route   GET /api/sources/verify/:url
// @access  Public
exports.verifySource = async (req, res) => {
  try {
    const { url } = req.params;

    if (!url) {
      return res.status(400).json({ error: 'Please provide a URL' });
    }

    // Extract domain from URL
    let domain = url;
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      domain = urlObj.hostname.replace('www.', '');
    } catch (error) {
      domain = url.replace('www.', '');
    }

    // Check if source is in credible list
    const sourceData = CREDIBLE_SOURCES[domain];

    if (sourceData) {
      return res.json({
        success: true,
        verified: true,
        data: {
          url: domain,
          ...sourceData,
          verdict: sourceData.credibility >= 80 ? 'Highly Credible' : 'Moderately Credible',
        },
      });
    }

    // If not in list, return unknown
    res.json({
      success: true,
      verified: false,
      data: {
        url: domain,
        credibility: null,
        verdict: 'Unknown Source - Please verify manually',
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Search sources by category
// @route   GET /api/sources/category/:category
// @access  Public
exports.getSourcesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const sources = Object.entries(CREDIBLE_SOURCES)
      .filter(([url, data]) => data.category === category.toLowerCase())
      .map(([url, data]) => ({
        url,
        ...data,
      }));

    if (sources.length === 0) {
      return res.status(404).json({ error: 'No sources found for this category' });
    }

    res.json({
      success: true,
      data: sources,
      total: sources.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get top credible sources
// @route   GET /api/sources/top
// @access  Public
exports.getTopSources = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const sources = Object.entries(CREDIBLE_SOURCES)
      .map(([url, data]) => ({
        url,
        ...data,
      }))
      .sort((a, b) => b.credibility - a.credibility)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: sources,
      total: sources.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add custom source (admin only)
// @route   POST /api/sources/add
// @access  Private
exports.addSource = async (req, res) => {
  try {
    const { url, credibility, category, founded } = req.body;

    if (!url || !credibility || !category) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (credibility < 0 || credibility > 100) {
      return res.status(400).json({ error: 'Credibility must be between 0 and 100' });
    }

    // In production, save to database
    // For now, just return success
    res.status(201).json({
      success: true,
      message: 'Source added successfully',
      data: {
        url,
        credibility,
        category,
        founded: founded || new Date().getFullYear(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
