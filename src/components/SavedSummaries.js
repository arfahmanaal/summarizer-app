import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SavedSummaries.css'; // Add custom styles for grid view

const SavedSummaries = () => {
  const [summaries, setSummaries] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentSummaryId, setCurrentSummaryId] = useState(null);
  const [editedSummary, setEditedSummary] = useState('');

  useEffect(() => {
    fetchSummaries();
  }, []);

  // Fetch saved summaries from the server
  const fetchSummaries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/summaries');
      setSummaries(response.data);
    } catch (error) {
      console.error('Error fetching summaries:', error);
    }
  };

  // Handle the deletion of a summary
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete-summary/${id}`);
      fetchSummaries();
    } catch (error) {
      console.error('Error deleting summary:', error);
    }
  };

  // Enable edit mode and set the current summary to be edited
  const handleEdit = (id, summarizedText) => {
    setEditMode(true);
    setCurrentSummaryId(id);
    setEditedSummary(summarizedText);
  };

  // Handle updating the summary after editing
  const handleUpdate = async () => {
    if (editedSummary.trim() === '') {
      alert('Summary cannot be empty');
      return;
    }
    try {
      // Sending the updated summary to the server
      await axios.put(`http://localhost:5000/api/update-summary/${currentSummaryId}`, { summary: editedSummary });
      setEditMode(false);
      setCurrentSummaryId(null);
      setEditedSummary('');
      fetchSummaries(); // Refresh the summary list after update
    } catch (error) {
      console.error('Error updating summary:', error);
    }
  };

  return (
    <div className="summaries-container">
      <h1>Saved Summaries</h1>
      {summaries.length > 0 ? (
        <div className="grid-container">
          {summaries.map((summaryItem) => (
            <div key={summaryItem._id} className="summary-card">
              {!editMode || currentSummaryId !== summaryItem._id ? (
                <div>
                  <p className="summary-text">{summaryItem.summarizedText}</p>
                  <button
                    onClick={() => handleEdit(summaryItem._id, summaryItem.summarizedText)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(summaryItem._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div>
                  <textarea
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    rows="5"
                    cols="50"
                    className="edit-textarea"
                  />
                  <button onClick={handleUpdate} className="update-btn">
                    Update Summary
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No summaries available.</p>
      )}
    </div>
  );
};

export default SavedSummaries;
