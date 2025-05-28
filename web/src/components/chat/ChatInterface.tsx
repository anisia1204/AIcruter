"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/ChatBot.module.css";
import { File, Send, BarChart3, FileSearch } from "lucide-react";
import ChatMessage, { Message } from "./ChatMessage";
import DocumentUpload from "./DocumentUpload";
import { getApiUrl, API_CONFIG } from "@/lib/api/config";

interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
}

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

interface ChatInterfaceProps {
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! 👋 I'm AIcruter Assistant. I can help you with:\n\n🎯 **Resume Analysis** - Upload your CV for detailed scoring\n🔍 **Resume Parsing** - Extract structured data from your resume\n💼 **Job Matching** - Get personalized job recommendations\n🎓 **Career Advice** - Interview prep and skill development\n\n📄 **Ready to start?** Upload your resume using the button below!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);
  const [isResumeActionsOpen, setIsResumeActionsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");

    try {
      // Call the AI chatbot backend
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHAT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      // Fallback response if backend is not available
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I received your message: "${currentInput}". I'm here to help with your job search and resume analysis. Try uploading your resume for detailed feedback!`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  const analyzeResumeScore = async (file: File) => {
    setIsAnalyzing(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `🎯 Analyzing resume score for: ${file.name}`,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENT_ANALYZE), {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const analysis = data.analysis;
        
        const scoreText = `📊 **Resume Analysis Results**

🎯 **Overall Score: ${analysis.overallScore}/100**

📈 **Score Breakdown:**
• Content Quality: ${analysis.scoreBreakdown.content}/100
• Structure: ${analysis.scoreBreakdown.structure}/100
• Keywords: ${analysis.scoreBreakdown.keywords}/100
• Experience: ${analysis.scoreBreakdown.experience}/100
• Education: ${analysis.scoreBreakdown.education}/100

🔧 **Top Skills Found:** ${analysis.skills.join(', ')}

💼 **Recommended Jobs:** ${analysis.recommendedJobs.join(', ')}

📝 **Improvement Suggestions:**
${analysis.improvements.map((imp: string) => `• ${imp}`).join('\n')}

✅ **Matched Keywords:** ${analysis.matchedKeywords.slice(0, 5).join(', ')}
❌ **Missing Keywords:** ${analysis.missingKeywords.join(', ')}`;

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: scoreText,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "❌ Sorry, I couldn't analyze your resume right now. Please try again or make sure the AI backend is running on port 5000.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
      setIsResumeActionsOpen(false);
    }
  };

  const parseResumeData = async (file: File) => {
    setIsAnalyzing(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `🔍 Parsing resume data from: ${file.name}`,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCUMENT_PARSE), {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data;
        
        const parseText = `📋 **Resume Parsing Results**

👤 **Personal Information:**
• Email: ${data.personalInfo.email || 'Not found'}
• Phone: ${data.personalInfo.phone || 'Not found'}
• Name: ${data.personalInfo.name || 'Requires advanced parsing'}
• Location: ${data.personalInfo.location || 'Requires advanced parsing'}

💻 **Skills Extracted:**
${data.skills.length > 0 ? data.skills.map((skill: string) => `• ${skill}`).join('\n') : '• No skills automatically extracted'}

💼 **Experience:**
${data.experience.length > 0 ? 
  data.experience.map((exp: ExperienceItem) => `• ${exp.title} at ${exp.company} (${exp.duration})`).join('\n') :
  '• Experience details require advanced parsing'}

🎓 **Education:**
${data.education.length > 0 ?
  data.education.map((edu: EducationItem) => `• ${edu.degree} from ${edu.institution} (${edu.year})`).join('\n') :
  '• Education details require advanced parsing'}

📜 **Certifications:** ${data.certifications.length > 0 ? data.certifications.join(', ') : 'None found'}

🌐 **Languages:** ${data.languages.length > 0 ? data.languages.join(', ') : 'None found'}

💡 **Note:** This is a basic parsing demo. Advanced parsing would extract more detailed information.`;

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: parseText,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('Parsing failed');
      }
    } catch (error) {
      console.error('Error parsing resume:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "❌ Sorry, I couldn't parse your resume right now. Please try again or make sure the AI backend is running on port 5000.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
      setIsResumeActionsOpen(false);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    // Create a message showing the file upload
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `📎 Uploaded CV: ${file.name}`,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsDocumentUploadOpen(false);

    // Show resume action buttons
    setIsResumeActionsOpen(true);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: `Great! I've received your resume "${file.name}". What would you like me to do with it?\n\n🎯 **Test Resume Score** - Get a detailed score and improvement suggestions\n🔍 **Parse Resume Data** - Extract structured information from your resume\n\nClick one of the action buttons below!`,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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

      {isResumeActionsOpen && (
        <div className={styles.resumeActionsContainer}>
          <div className={styles.resumeActions}>
            <button
              className={`${styles.resumeActionButton} ${styles.scoreButton}`}
              onClick={() => {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.pdf,.doc,.docx,.txt';
                fileInput.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) analyzeResumeScore(file);
                };
                fileInput.click();
              }}
              disabled={isAnalyzing}
              title="Analyze resume and get score with improvements"
            >
              <BarChart3 size={18} />
              {isAnalyzing ? 'Analyzing...' : 'Test Resume Score'}
            </button>
            
            <button
              className={`${styles.resumeActionButton} ${styles.parseButton}`}
              onClick={() => {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.pdf,.doc,.docx,.txt';
                fileInput.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) parseResumeData(file);
                };
                fileInput.click();
              }}
              disabled={isAnalyzing}
              title="Extract structured data from resume"
            >
              <FileSearch size={18} />
              {isAnalyzing ? 'Parsing...' : 'Parse Resume Data'}
            </button>
          </div>
          
          <button
            className={styles.cancelButton}
            onClick={() => setIsResumeActionsOpen(false)}
          >
            Close Actions
          </button>
        </div>
      )}

      <div className={styles.inputContainer}>
        <button
          className={styles.uploadButton}
          onClick={() => setIsDocumentUploadOpen(!isDocumentUploadOpen)}
          title="Upload a document"
        >
          <File />
        </button>

        <textarea
          className={styles.messageInput}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          rows={1}
        />

        <button
          className={styles.sendButton}
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          title="Send message"
        >
          <Send />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
