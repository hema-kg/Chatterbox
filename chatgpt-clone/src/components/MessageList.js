// src/components/MessageList.js
import React from 'react';
import Message from './Message';

const MessageList = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map(msg => (
        <Message key={msg.id} text={msg.text} sender={msg.sender} />
      ))}
    </div>
  );
};

export default MessageList;
