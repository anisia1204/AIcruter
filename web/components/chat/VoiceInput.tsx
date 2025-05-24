"use client";

import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import styles from '../../styles/ChatBot.module.css'; // Update the import path

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if browser supports SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        
        recognitionInstance.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
            
          if (event.results[0].isFinal) {
            onVoiceInput(transcript);
            stopListening();
          }
        };
        
        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          stopListening();
        };
        
        setRecognition(recognitionInstance);
      }
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onVoiceInput]);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start recording:', error);
      }
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <button 
      className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
      onClick={isListening ? stopListening : startListening}
      title={isListening ? "Stop recording" : "Start voice input"}
    >
      {isListening ? <FaStop /> : <FaMicrophone />}
    </button>
  );
};

export default VoiceInput;
