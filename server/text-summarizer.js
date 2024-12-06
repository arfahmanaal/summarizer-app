const natural = require('natural');
const stopwords = require('stopwords').english;

// Function to summarize text
function summarizeText(text) {
  // Tokenize the text into words and convert them to lowercase
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(text.toLowerCase());

  // Filter out stopwords and short words
  const filteredWords = words.filter(word => !stopwords.includes(word) && word.length > 1);

  // Calculate word frequency
  const frequency = filteredWords.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  // Sort words by frequency in descending order
  const sortedWords = Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .map(([word]) => word);

  // Split the text into sentences
  const sentences = text.split(/[.?!]\s/);

  // Filter sentences containing high-frequency words (but not too many)
  const summarySentences = sentences.filter(sentence => {
    // Check if sentence has more than 2 frequent words
    const wordsInSentence = tokenizer.tokenize(sentence.toLowerCase());
    const relevantWords = wordsInSentence.filter(word => sortedWords.includes(word));
    return relevantWords.length > 2; // adjust the threshold for more accurate summaries
  });

  // Combine filtered sentences into a more concise summary
  const summary = summarySentences.join('. ') + '.';

  // Ensure the summary is not too long, e.g., limiting to 3-4 sentences
  const maxSummaryLength = 3;
  const finalSummary = summarySentences.slice(0, maxSummaryLength).join('. ') + '.';

  return finalSummary;
}

module.exports = { summarizeText };
