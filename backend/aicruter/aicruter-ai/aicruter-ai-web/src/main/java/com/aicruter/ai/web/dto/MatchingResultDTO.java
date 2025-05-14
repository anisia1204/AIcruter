package com.aicruter.ai.ai.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchingResultDTO {
    private Long analysisId;
    private String applicantId;
    private String jobId;
    private String[] matchingSkills;
    private String[] missingSkills;
    private boolean experienceMatch;
    private boolean educationMatch;
    private int estimatedYearsExperience;
    private Double overallMatchScore;
}