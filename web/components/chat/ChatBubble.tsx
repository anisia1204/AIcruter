"use client";

import React from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import styles from '@/styles/ChatBot.module.css';

interface ChatBubbleProps {
  isOpen: boolean;
  toggleChat: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ isOpen, toggleChat }) => {
  return (
    <div 
      className={styles.chatBubble} 
      onClick={!isOpen ? toggleChat : undefined}
    >
      {!isOpen ? (
        <div className={styles.bubbleContent}>
          <FaRobot size={24} />
          <span className={styles.bubbleText}>AI Assistant</span>
        </div>
      ) : (
        <div className={styles.closeButton} onClick={toggleChat}>
          <FaTimes size={24} />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
