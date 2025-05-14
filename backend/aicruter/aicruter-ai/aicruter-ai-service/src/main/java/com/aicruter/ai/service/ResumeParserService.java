package com.aicruter.ai.service;

import java.io.InputStream;
import java.util.Map;

/**
 * Service for parsing resume documents
 */
public interface ResumeParserService {
    
    /**
     * Extracts text from resume files (PDF or DOCX)
     * 
     * @param inputStream InputStream of the resume file
     * @param fileName Original file name with extension
     * @return Extracted text from the resume
     */
    String extractTextFromResume(InputStream inputStream, String fileName);
    
    /**
     * Parse a resume and extract key information and skills
     * 
     * @param resumeText The text content of the resume
     * @return Map of extracted information including skills, education, experience, etc.
     */
    Map<String, Object> parseResume(String resumeText);
    
    /**
     * Analyze a resume and save the analysis results
     * 
     * @param resumeText The text content of the resume
     * @param applicantId The ID of the applicant
     * @return ID of the saved analysis
     */
    Long analyzeResume(String resumeText, Long applicantId);
}