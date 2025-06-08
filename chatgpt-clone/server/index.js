// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // Import OpenAI

const app = express();
const port = process.env.PORT || 3001;

// Initialize OpenAI client
// Ensure your OPENAI_API_KEY is set in your .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AI Backend Server is running!');
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  console.log('Received message on backend for OpenAI:', message);

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is missing. Make sure it is set in .env');
    return res.status(500).json({ error: 'Server configuration error: Missing API key.' });
  }

  try {
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' }, // Optional: System message to set AI behavior
        { role: 'user', content: message },
      ],
      model: 'gpt-3.5-turbo', // Or your preferred model, e.g., 'gpt-4'
      // max_tokens: 150, // Optional: limit response length
    });

    const aiReply = completion.choices[0]?.message?.content?.trim();

    if (aiReply) {
      res.json({ reply: aiReply });
    } else {
      console.error('OpenAI response was empty or in unexpected format:', completion);
      res.status(500).json({ error: 'Failed to get a valid response from AI' });
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
        res.status(401).json({ error: 'OpenAI API authentication error. Check your API key.' });
    } else if (error.response && error.response.status === 429) {
        res.status(429).json({ error: 'OpenAI API rate limit exceeded. Please try again later.' });
    }
    else {
        res.status(500).json({ error: 'An error occurred while communicating with the AI.' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn('WARNING: OPENAI_API_KEY is not set in .env file. The /api/chat endpoint will not work.');
  } else {
    console.log('OpenAI API key loaded successfully.');
  }
});
