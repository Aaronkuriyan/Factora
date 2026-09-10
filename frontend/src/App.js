import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import NewsChecker from './components/NewsChecker';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckNews = async (text, url) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('/api/check', { text, url });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Factora</h1>
        <p>Detect Fake News. Verify Truth.</p>
      </header>

      <main className="container">
        <NewsChecker onCheck={handleCheckNews} loading={loading} />
        
        {error && <div className="error-message">{error}</div>}
        
        {result && <ResultsDisplay result={result} />}
      </main>

      <footer className="footer">
        <p>&copy; 2026 Factora. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
