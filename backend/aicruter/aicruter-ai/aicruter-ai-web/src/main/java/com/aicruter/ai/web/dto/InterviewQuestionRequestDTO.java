package com.aicruter.ai.ai.web.dto;

import lombok.Data;

@Data
public class InterviewQuestionRequestDTO {
    private String jobId;
    private String applicantId;
    private int numberOfQuestions;
}