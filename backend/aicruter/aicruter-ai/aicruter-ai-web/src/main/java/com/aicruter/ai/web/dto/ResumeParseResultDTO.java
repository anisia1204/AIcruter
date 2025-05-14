package com.aicruter.ai.ai.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeParseResultDTO {
    private Long analysisId;
    private String applicantId;
    private String parsedName;
    private String parsedEmail;
    private String parsedPhone;
    private String[] skills;
    private String education;
    private String experience;
    private Double confidenceScore;
}