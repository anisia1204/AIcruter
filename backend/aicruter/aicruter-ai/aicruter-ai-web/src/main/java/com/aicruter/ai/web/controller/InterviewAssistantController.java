package com.aicruter.ai.web.controller;

import com.aicruter.ai.domain.InterviewQuestion;
import com.aicruter.ai.service.InterviewAssistantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai/interview")
public class InterviewAssistantController {
    
    private final InterviewAssistantService interviewAssistantService;
    
    public InterviewAssistantController(InterviewAssistantService interviewAssistantService) {
        this.interviewAssistantService = interviewAssistantService;
    }
    
    @GetMapping("/questions/job/{jobId}/candidate/{applicantId}")
    public ResponseEntity<List<InterviewQuestion>> generateQuestionsForJobAndCandidate(
            @PathVariable String jobId,
            @PathVariable String applicantId,
            @RequestParam(defaultValue = "5") int count) {
        List<InterviewQuestion> questions = interviewAssistantService.generateQuestionsForJobAndCandidate(
                jobId, applicantId, count);
        return ResponseEntity.ok(questions);
    }
    
    @PostMapping("/questions/skills")
    public ResponseEntity<List<InterviewQuestion>> generateQuestionsForSkills(
            @RequestBody List<String> skills,
            @RequestParam(defaultValue = "Intermediate") String difficultyLevel,
            @RequestParam(defaultValue = "5") int count) {
        List<InterviewQuestion> questions = interviewAssistantService.generateQuestionsForSkills(
                skills, difficultyLevel, count);
        return ResponseEntity.ok(questions);
    }
}