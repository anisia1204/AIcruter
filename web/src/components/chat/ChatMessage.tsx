"use client";

import styles from "@/styles/ChatBot.module.css";
import { Bot, User } from "lucide-react";
import React from "react";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <div
      className={`${styles.message} ${
        isBot ? styles.botMessage : styles.userMessage
      }`}
    >
      <div className={styles.messageIcon}>{isBot ? <Bot /> : <User />}</div>
      <div className={styles.messageContent}>
        <div className={styles.messageText}>{message.text}</div>
        <div className={styles.messageTime}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
