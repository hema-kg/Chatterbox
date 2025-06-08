// src/App.js
import React, { useState } from 'react'; // Import useState
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import './App.css';

function App() {
  // Initialize messages state with a welcome message
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! Type a message to start.', sender: 'ai' }
  ]);

  const handleSendMessage = (messageText) => {
    // Create new user message object
    const newUserMessage = {
      id: Date.now(), // Simple ID generation
      text: messageText,
      sender: 'user',
    };

    // Update messages state
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1, // Ensure unique ID
        text: `Echo: ${messageText}`, // Simple echo response
        sender: 'ai',
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 500); // 500ms delay

    console.log("User message added, AI echo queued:", newUserMessage);
  };

  return (
    <div className="App">
      <h1>Chatterbox</h1>
      <MessageList messages={messages} /> {/* Pass the state to MessageList */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;
