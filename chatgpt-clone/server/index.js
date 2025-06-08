// server/index.js
require('dotenv').config(); // Keep for now, though OPENAI_API_KEY won't be used directly for responses
const express = require('express');
const cors = require('cors');
// const OpenAI = require('openai'); // Comment out or remove OpenAI import

const app = express();
const port = process.env.PORT || 3001;

// Comment out or remove OpenAI client initialization
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AI Backend Server is running (Mock AI Mode)!');
});

const genericReplies = [
  "That's interesting!",
  "Tell me more.",
  "I see.",
  "Fascinating!",
  "Hmm, I'll have to think about that.",
  "Okay, what else?",
  "Interesting perspective."
];
let genericReplyIndex = 0;

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const lowerCaseMessage = message ? message.toLowerCase() : "";
  console.log('Received message for Mock AI:', message);

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  let aiReply = "";

  if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
    aiReply = "Hi there! I'm a friendly mock AI. How can I pretend to help you today?";
  } else if (lowerCaseMessage.includes("how are you")) {
    aiReply = "I'm just a bunch of mock code, but I'm feeling great! Thanks for asking!";
  } else if (lowerCaseMessage.includes("help")) {
    aiReply = "I can offer some pre-programmed responses. Try asking 'how are you', say 'hello', or tell me something interesting!";
  } else if (lowerCaseMessage.includes("what can you do")) {
    aiReply = "I can chat with you using a set of predefined responses. I'm here to help test this cool chat interface!";
  } else {
    aiReply = genericReplies[genericReplyIndex];
    genericReplyIndex = (genericReplyIndex + 1) % genericReplies.length; // Cycle through generic replies
  }

  // Simulate network delay
  setTimeout(() => {
    res.json({ reply: aiReply });
  }, 700 + Math.random() * 500); // Simulate 0.7 to 1.2 seconds delay
});

app.listen(port, () => {
  console.log(`Mock AI Server listening at http://localhost:${port}`);
  // console.log('OpenAI API key checks are disabled in Mock AI mode.'); // Optional: indicate mock mode
});
