require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { summarizeText } = require('./text-summarizer'); // Importing the summarizer logic

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema for summaries
const summarySchema = new mongoose.Schema({
  text: { type: String, required: true },
  summarizedText: { type: String, required: true },
});

// Model for summaries
const Summary = mongoose.model('Summary', summarySchema);

// API route to summarize text
app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required for summarization' });
  }

  try {
    // Generate summary
    const summarizedText = await summarizeText(text); // Make sure this is async if necessary
    res.json({ summary: summarizedText });
  } catch (error) {
    console.error('Error during summarization:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API route to save the summarized text
app.post('/api/save-summary', async (req, res) => {
  const { text, summary } = req.body;

  if (!text || !summary) {
    return res.status(400).json({ error: 'Text and summary are required' });
  }

  try {
    // Save the original text and summary to MongoDB
    const newSummary = new Summary({ text, summarizedText: summary });
    await newSummary.save();
    res.status(200).json({ message: 'Summary saved successfully' });
  } catch (error) {
    console.error('Error saving summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API route to get all summaries
app.get('/api/summaries', async (req, res) => {
  try {
    const summaries = await Summary.find();
    res.json(summaries);
  } catch (error) {
    console.error('Error fetching summaries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API route to update a summary
app.put('/api/update-summary/:id', async (req, res) => {
  const { id } = req.params;
  const { summary } = req.body;  // Only need the summary, not the original text

  if (!summary) {
    return res.status(400).json({ error: 'Summary is required' });
  }

  try {
    // Find the summary by ID and update the summarizedText field
    const updatedSummary = await Summary.findByIdAndUpdate(
      id,
      { summarizedText: summary },  // Update only the summarizedText, not the original text
      { new: true }
    );

    if (!updatedSummary) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    res.status(200).json(updatedSummary);
  } catch (error) {
    console.error('Error updating summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API route to delete a summary
app.delete('/api/delete-summary/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSummary = await Summary.findByIdAndDelete(id);
    if (!deletedSummary) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    res.status(200).json({ message: 'Summary deleted successfully' });
  } catch (error) {
    console.error('Error deleting summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
