package com.aicruter.ai.service.impl;

import com.aicruter.ai.domain.InterviewQuestion;
import com.aicruter.ai.service.InterviewAssistantService;
import org.springframework.stereotype.Service;
import org.springframework.ai.client.AiClient;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class InterviewAssistantServiceImpl implements InterviewAssistantService {

    private final AiClient aiClient;
    
    public InterviewAssistantServiceImpl(AiClient aiClient) {
        this.aiClient = aiClient;
    }
    
    @Override
    public List<InterviewQuestion> generateQuestionsForJobAndCandidate(String jobId, String applicantId, int count) {
        // Retrieve job requirements and candidate profile
        // Use this data to create personalized questions
        
        String prompt = "Generate " + count + " interview questions for a candidate applying for this position. " +
                "Questions should assess their skills and experience, and identify potential gaps. " +
                "For each question, include: the question itself, skill category being assessed, difficulty level, " +
                "and key points to look for in a good response.\n" +
                "Job details: [would be populated from DB]\n" +
                "Candidate details: [would be populated from DB]";
        
        String aiResponse = aiClient.prompt(prompt).getResult();
        
        // Parse the AI response to extract structured question data
        return parseAiResponseToQuestions(aiResponse, count);
    }
    
    @Override
    public List<InterviewQuestion> generateQuestionsForSkills(List<String> skills, String difficultyLevel, int count) {
        String skillsText = String.join(", ", skills);
        
        String prompt = "Generate " + count + " " + difficultyLevel + " level technical interview questions " +
                "to assess the following skills: " + skillsText + ". " +
                "For each question, include: the question itself, the specific skill being assessed, " +
                "and key points to look for in a good response.";
        
        String aiResponse = aiClient.prompt(prompt).getResult();
        
        // Parse the AI response to extract structured question data
        return parseAiResponseToQuestions(aiResponse, count);
    }
    
    private List<InterviewQuestion> parseAiResponseToQuestions(String aiResponse, int expectedCount) {
        // This would parse the AI text response into structured questions
        // Simplified implementation:
        List<InterviewQuestion> questions = new ArrayList<>();
        
        // In a real implementation, this would parse the AI's response
        // Here's an example of what one parsed question might look like:
        InterviewQuestion sampleQuestion = InterviewQuestion.builder()
                .id(UUID.randomUUID().toString())
                .question("Explain how you would design a microservices architecture for a high-traffic e-commerce platform.")
                .skillCategory("System Design")
                .difficultyLevel("Advanced")
                .expectedResponsePoints("Should mention: service boundaries, API gateway, data consistency, fault tolerance")
                .build();
        
        questions.add(sampleQuestion);
        
        // Add more sample questions to reach the expected count
        for (int i = 1; i < expectedCount; i++) {
            questions.add(InterviewQuestion.builder()
                    .id(UUID.randomUUID().toString())
                    .question("Sample question " + i)
                    .skillCategory("Sample category")
                    .difficultyLevel("Intermediate")
                    .expectedResponsePoints("Sample expected points")
                    .build());
        }
        
        return questions;
    }
}