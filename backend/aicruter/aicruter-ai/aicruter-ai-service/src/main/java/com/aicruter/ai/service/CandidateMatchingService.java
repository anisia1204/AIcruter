package com.aicruter.ai.service;

import com.aicruter.ai.domain.entity.AIAnalysis;

public interface CandidateMatchingService {
    
    /**
     * Matches a candidate's skills and experience with job requirements
     * 
     * @param applicantId the ID of the applicant
     * @param jobId the ID of the job
     * @return an AIAnalysis object containing the matching results
     */
    AIAnalysis matchCandidateToJob(String applicantId, String jobId);
    
    /**
     * Calculates a compatibility score between a candidate and a job
     * 
     * @param applicantId the ID of the applicant
     * @param jobId the ID of the job
     * @return a score between 0 and 1 indicating compatibility
     */
    Double calculateCompatibilityScore(String applicantId, String jobId);
}