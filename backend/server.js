const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

/**
 * Check news article for credibility
 * POST /api/check
 * Body: { text: string, url?: string }
 */
app.post('/api/check', async (req, res) => {
  try {
    const { text, url } = req.body;

    if (!text && !url) {
      return res.status(400).json({ error: 'Please provide either text or URL' });
    }

    // TODO: Implement fact-checking logic
    // This will integrate with Google Fact Check API and/or NewsAPI

    const result = {
      credibility: 'PENDING',
      score: 0,
      analysis: 'Checking against fact-checking databases...',
      sources: []
    };

    res.json(result);
  } catch (error) {
    console.error('Error checking news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Search for fact-checks on a topic
 * GET /api/search?q=query
 */
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    // TODO: Implement search functionality

    res.json({ results: [] });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
