// Email validation
const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// URL validation
const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Validation middleware for request body
const validateRequest = (req, res, next) => {
  // Check if body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body cannot be empty' });
  }
  next();
};

// Validate analysis input
const validateAnalysisInput = (req, res, next) => {
  const { url, text } = req.body;

  if (!url && !text) {
    return res.status(400).json({ error: 'Either URL or text must be provided' });
  }

  if (url && !validateURL(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  if (text && text.trim().length < 10) {
    return res.status(400).json({ error: 'Text must be at least 10 characters' });
  }

  next();
};

module.exports = {
  validateEmail,
  validateURL,
  validateRequest,
  validateAnalysisInput,
};
