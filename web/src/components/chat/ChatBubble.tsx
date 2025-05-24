"use client";

import React from "react";
import styles from "@/styles/ChatBot.module.css";
import { Bot, X } from "lucide-react";

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
          <Bot size={24} />
          <span className={styles.bubbleText}>AI Assistant</span>
        </div>
      ) : (
        <div className={styles.closeButton} onClick={toggleChat}>
          <X size={24} />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
