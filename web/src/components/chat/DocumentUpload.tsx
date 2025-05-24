"use client";

import React, { useRef, useState } from 'react';
import { FaFile, FaUpload } from 'react-icons/fa';
import styles from '@/styles/ChatBot.module.css';

interface DocumentUploadProps {
  onDocumentUpload: (file: File) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onDocumentUpload(e.target.files[0]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDocumentUpload(e.dataTransfer.files[0]);
    }
  };
  
  return (
    <div className={styles.documentUploadContainer}>
      <div 
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FaUpload size={20} />
        <span>Upload your CV</span>
        <span className={styles.supportedFormats}>.pdf, .docx, .doc</span>
      </div>
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx"
      />
    </div>
  );
};

export default DocumentUpload;
