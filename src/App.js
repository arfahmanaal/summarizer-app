import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Summarizer from './components/summarizer';
import SavedSummaries from './components/SavedSummaries';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Summarizer />} />
        <Route path="/saved-summaries" element={<SavedSummaries />} />
      </Routes>
    </Router>
  );
};

export default App;
