// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import './App.css'; // Ensure this is imported

function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! Ask me something.', sender: 'ai' }
  ]);
  const [isLoading, setIsLoading] = useState(false); // New state for loading status
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    const newUserMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setIsLoading(true); // Set loading to true before API call

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      setIsLoading(false); // Set loading to false once response is received

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.reply) {
        const aiMessage = {
          id: Date.now() + 1,
          text: data.reply,
          sender: 'ai',
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } else {
        // This case might indicate a valid response (200 OK) but no reply content
        setMessages(prevMessages => [...prevMessages, {
          id: Date.now() + 1,
          text: 'AI did not provide a reply. Please try again.',
          sender: 'ai',
          isError: true,
        }]);
      }

    } catch (error) {
      setIsLoading(false); // Also set loading to false in case of error
      console.error('Failed to send message or get AI reply:', error);
      const errorMessageText = error.message || 'Could not connect to the AI service.';
      setMessages(prevMessages => [...prevMessages, {
        id: Date.now() + 1,
        text: `Error: ${errorMessageText}`,
        sender: 'ai',
        isError: true,
      }]);
    }
  };

  return (
    <div className="App">
      <h1>ChatGPT Clone (with Real AI)</h1>
      <MessageList messages={messages} />
      {/* Display loading indicator */}
      {isLoading && (
        <div className="loading-indicator">
          <p>AI is thinking...</p>
        </div>
      )}
      <div ref={messagesEndRef} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;
