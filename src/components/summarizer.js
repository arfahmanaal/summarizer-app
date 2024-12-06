import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Use Link to navigate to SavedSummaries page
import './Summarizer.css';

const Summarizer = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarySaved, setIsSummarySaved] = useState(false);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSummarize = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/summarize', { text });
      setSummary(response.data.summary);
      setIsSummarySaved(false);
    } catch (error) {
      console.error('Error summarizing text:', error);
      setSummary('Error summarizing the text.');
    }
  };

  const handleSave = async () => {
    if (summary) {
      try {
        await axios.post('http://localhost:5000/api/save-summary', { text, summary });
        setIsSummarySaved(true);
      } catch (error) {
        console.error('Error saving summary:', error);
        setIsSummarySaved(false);
      }
    }
  };

  return (
    <div className="summarizer-container">
      <h1>Text Summarizer</h1>

      <form onSubmit={handleSummarize} className="form-container">
        <textarea
          value={text}
          onChange={handleTextChange}
          rows="10"
          cols="50"
          placeholder="Enter text to summarize"
          className="textarea"
        />
        <button type="submit" className="summarize-btn">Summarize</button>
      </form>

      {summary && (
        <div className="summary-container">
          <h2>Summary</h2>
          <p>{summary}</p>
          <button onClick={handleSave} className="save-btn" disabled={isSummarySaved}>
            {isSummarySaved ? 'Saved' : 'Save'}
          </button>
          {isSummarySaved && <p>Summary saved successfully!</p>}
        </div>
      )}

      {/* Link to navigate to the saved summaries page */}
      <Link to="/saved-summaries" className="view-summaries-link">
        View Saved Summaries
      </Link>
    </div>
  );
};

export default Summarizer;
