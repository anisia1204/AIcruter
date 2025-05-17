package com.aicruter.ai.web.controller;

import com.aicruter.ai.domain.ResumeAnalysisResult;
import com.aicruter.ai.service.ResumeParsingService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/ai/resume")
public class ResumeAnalysisController {
    
    private final ResumeParsingService resumeParsingService;
    
    public ResumeAnalysisController(ResumeParsingService resumeParsingService) {
        this.resumeParsingService = resumeParsingService;
    }
    
    @PostMapping(value = "/parse", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeAnalysisResult> parseResume(@RequestParam("file") MultipartFile file) {
        try {
            String fileType = file.getContentType();
            ResumeAnalysisResult result = resumeParsingService.parseResume(file.getInputStream(), fileType);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/match/{resumeId}/job/{jobId}")
    public ResponseEntity<ResumeAnalysisResult> matchResumeToJob(
            @PathVariable String resumeId,
            @PathVariable String jobId) {
        ResumeAnalysisResult result = resumeParsingService.matchResumeToJob(resumeId, jobId);
        return ResponseEntity.ok(result);
    }
}