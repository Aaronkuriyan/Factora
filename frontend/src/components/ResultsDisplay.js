import React from 'react';
import './ResultsDisplay.css';

function ResultsDisplay({ result }) {
  const getCredibilityColor = (credibility) => {
    switch (credibility) {
      case 'TRUE':
        return '#51cf66';
      case 'FALSE':
        return '#ff6b6b';
      case 'PARTIALLY_TRUE':
        return '#ffd43b';
      default:
        return '#a9a9a9';
    }
  };

  return (
    <div className="results-display">
      <div className="result-header">
        <h2>Fact-Check Results</h2>
      </div>

      <div className="credibility-card">
        <div className="credibility-indicator" style={{ borderLeftColor: getCredibilityColor(result.credibility) }}>
          <div className="credibility-status">
            <span className="status-label">Credibility:</span>
            <span className="status-value" style={{ color: getCredibilityColor(result.credibility) }}>
              {result.credibility || 'PENDING'}
            </span>
          </div>
          <div className="credibility-score">
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${result.score * 100}%`, backgroundColor: getCredibilityColor(result.credibility) }}></div>
            </div>
            <span className="score-text">{(result.score * 100).toFixed(0)}% Credible</span>
          </div>
        </div>
      </div>

      {result.analysis && (
        <div className="analysis-section">
          <h3>Analysis</h3>
          <p>{result.analysis}</p>
        </div>
      )}

      {result.sources && result.sources.length > 0 && (
        <div className="sources-section">
          <h3>Sources</h3>
          <ul>
            {result.sources.map((source, index) => (
              <li key={index}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ResultsDisplay;
