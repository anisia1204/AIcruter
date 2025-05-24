"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaFile } from 'react-icons/fa';
import ChatMessage, { Message } from './ChatMessage';
import VoiceInput from './VoiceInput';
import DocumentUpload from './DocumentUpload';
import styles from '@/styles/ChatBot.module.css';

interface ChatInterfaceProps {
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I\'m AIcruter Assistant. How can I help you with your job search or resume today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I received your message: "${inputText}". This is a placeholder response. In the real implementation, this would be handled by the AI backend.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };
  
  const handleVoiceInput = (text: string) => {
    setInputText(text);
  };
  
  const handleDocumentUpload = async (file: File) => {
    // Create a message showing the file upload
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `Uploaded CV: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsDocumentUploadOpen(false);
    
    // Here you would normally upload the file to your backend
    // For now, let's just simulate a response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Thanks for uploading your CV! I'll analyze it and provide some insights soon. (This is a placeholder - in the real implementation, we would process your CV on the backend.)`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className={styles.chatInterface}>
      <div className={styles.chatHeader}>
        <h3>AI Recruiter Assistant</h3>
      </div>
      
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {isDocumentUploadOpen && (
        <div className={styles.documentUploadWrapper}>
          <DocumentUpload onDocumentUpload={handleDocumentUpload} />
          <button 
            className={styles.cancelButton}
            onClick={() => setIsDocumentUploadOpen(false)}
          >
            Cancel
          </button>
        </div>
      )}
      
      <div className={styles.inputContainer}>
        <button 
          className={styles.uploadButton} 
          onClick={() => setIsDocumentUploadOpen(!isDocumentUploadOpen)}
          title="Upload a document"
        >
          <FaFile />
        </button>
        
        <textarea
          className={styles.messageInput}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          rows={1}
        />
        
        <VoiceInput onVoiceInput={handleVoiceInput} />
        
        <button 
          className={styles.sendButton} 
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          title="Send message"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
