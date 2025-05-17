package com.aicruter.ai.web.controller;

import com.aicruter.ai.ai.domain.entity.AIAnalysis;
import com.aicruter.ai.ai.service.CandidateMatchingService;
import com.aicruter.ai.ai.web.dto.MatchingResultDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai/matching")
public class CandidateMatchingController {

    private final CandidateMatchingService candidateMatchingService;

    @PostMapping("/job/{jobId}/applicant/{applicantId}")
    public ResponseEntity<MatchingResultDTO> matchCandidateToJob(
            @PathVariable String jobId,
            @PathVariable String applicantId) {
        
        AIAnalysis analysis = candidateMatchingService.matchCandidateToJob(applicantId, jobId);
        
        MatchingResultDTO result = MatchingResultDTO.builder()
                .analysisId(analysis.getId())
                .applicantId(applicantId)
                .jobId(jobId)
                .matchingSkills(parseSkillsList(analysis.getResults().get("matching_skills")))
                .missingSkills(parseSkillsList(analysis.getResults().get("missing_skills")))
                .experienceMatch(Boolean.parseBoolean(analysis.getResults().getOrDefault("experience_match", "false")))
                .educationMatch(Boolean.parseBoolean(analysis.getResults().getOrDefault("education_match", "false")))
                .estimatedYearsExperience(Integer.parseInt(analysis.getResults().getOrDefault("estimated_years_experience", "0")))
                .overallMatchScore(analysis.getConfidenceScore())
                .build();
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/score/job/{jobId}/applicant/{applicantId}")
    public ResponseEntity<Map<String, Object>> getCompatibilityScore(
            @PathVariable String jobId,
            @PathVariable String applicantId) {
        
        Double score = candidateMatchingService.calculateCompatibilityScore(applicantId, jobId);
        
        return ResponseEntity.ok(Map.of(
            "applicantId", applicantId,
            "jobId", jobId,
            "compatibilityScore", score
        ));
    }
    
    private String[] parseSkillsList(String skillsString) {
        if (skillsString == null || skillsString.isEmpty()) {
            return new String[0];
        }
        return Arrays.stream(skillsString.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toArray(String[]::new);
    }
}