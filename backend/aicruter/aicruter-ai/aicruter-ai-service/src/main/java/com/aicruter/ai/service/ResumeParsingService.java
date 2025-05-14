package com.aicruter.ai.domain.service;

import com.aicruter.ai.domain.ResumeAnalysisResult;
import java.io.InputStream;

public interface ResumeParsingService {
    ResumeAnalysisResult parseResume(InputStream resumeFile, String fileType);
    ResumeAnalysisResult matchResumeToJob(String resumeId, String jobId);
}