package com.aicruter.ai.web.controller;

import com.aicruter.ai.ai.domain.entity.AIAnalysis;
import com.aicruter.ai.ai.service.ResumeParserService;
import com.aicruter.ai.ai.web.dto.ResumeParseResultDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai/resume")
public class ResumeParserController {

    private final ResumeParserService resumeParserService;

    @PostMapping(value = "/parse", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeParseResultDTO> parseResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("applicantId") String applicantId) {
        
        try {
            AIAnalysis analysis = resumeParserService.parseResume(
                    file.getInputStream(),
                    file.getOriginalFilename(),
                    applicantId
            );
            
            ResumeParseResultDTO result = ResumeParseResultDTO.builder()
                    .analysisId(analysis.getId())
                    .applicantId(applicantId)
                    .parsedName(analysis.getResults().getOrDefault("name", ""))
                    .parsedEmail(analysis.getResults().getOrDefault("email", ""))
                    .parsedPhone(analysis.getResults().getOrDefault("phone", ""))
                    .skills(analysis.getResults().getOrDefault("skills", "").split(","))
                    .education(analysis.getResults().getOrDefault("education", ""))
                    .experience(analysis.getResults().getOrDefault("experience", ""))
                    .confidenceScore(analysis.getConfidenceScore())
                    .build();
            
            return ResponseEntity.ok(result);
            
        } catch (IOException e) {
            log.error("Error parsing resume", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/skills/{applicantId}")
    public ResponseEntity<List<String>> extractSkillsForApplicant(@PathVariable String applicantId) {
        // Implementation would retrieve the latest CV analysis for this applicant
        // and return the extracted skills
        
        // Mocked implementation
        return ResponseEntity.ok(List.of("java", "spring", "hibernate", "docker"));
    }
}