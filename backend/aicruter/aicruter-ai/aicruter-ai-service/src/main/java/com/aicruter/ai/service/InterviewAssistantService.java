package com.aicruter.ai.service;

import java.util.List;

public interface InterviewAssistantService {
    
    /**
     * Generates interview questions based on job requirements and candidate profile
     * 
     * @param jobId the ID of the job
     * @param applicantId the ID of the applicant
     * @param numberOfQuestions the number of questions to generate
     * @return a list of generated questions
     */
    List<String> generateInterviewQuestions(String jobId, String applicantId, int numberOfQuestions);
    
    /**
     * Analyzes interview responses for sentiment and relevance
     * 
     * @param response the candidate's response
     * @param question the question that was asked
     * @return a map containing sentiment analysis results
     */
    java.util.Map<String, Object> analyzeResponse(String response, String question);
}