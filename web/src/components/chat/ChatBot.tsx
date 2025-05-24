"use client";

import React, { useState } from 'react';
import ChatBubble from './ChatBubble';
import ChatInterface from './ChatInterface';
import styles from '@/styles/ChatBot.module.css';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className={styles.chatbotContainer}>
      {isOpen && (
        <div className={styles.chatInterfaceWrapper}>
          <ChatInterface onClose={toggleChat} />
        </div>
      )}
      <ChatBubble isOpen={isOpen} toggleChat={toggleChat} />
    </div>
  );
};

export default ChatBot;
