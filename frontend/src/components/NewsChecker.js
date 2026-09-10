import React, { useState } from 'react';
import './NewsChecker.css';

function NewsChecker({ onCheck, loading }) {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState('text');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'text' && !text.trim()) {
      alert('Please enter some text to check');
      return;
    }
    
    if (activeTab === 'url' && !url.trim()) {
      alert('Please enter a URL to check');
      return;
    }

    onCheck(text, url);
  };

  return (
    <div className="news-checker">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          Check Text
        </button>
        <button
          className={`tab ${activeTab === 'url' ? 'active' : ''}`}
          onClick={() => setActiveTab('url')}
        >
          Check URL
        </button>
      </div>

      <form onSubmit={handleSubmit} className="checker-form">
        {activeTab === 'text' && (
          <textarea
            className="input-field"
            placeholder="Paste the news article or statement here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="6"
            disabled={loading}
          />
        )}

        {activeTab === 'url' && (
          <input
            className="input-field"
            type="url"
            placeholder="Enter the news article URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Now'}
        </button>
      </form>
    </div>
  );
}

export default NewsChecker;
