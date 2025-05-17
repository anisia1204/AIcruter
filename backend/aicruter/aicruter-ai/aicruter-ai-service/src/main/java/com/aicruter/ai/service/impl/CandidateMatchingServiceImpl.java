package com.aicruter.ai.service.impl;

import com.aicruter.ai.domain.entity.AIAnalysis;
import com.aicruter.ai.domain.repository.AIAnalysisRepository;
import com.aicruter.ai.service.CandidateMatchingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CandidateMatchingServiceImpl implements CandidateMatchingService {

    private static final Logger log = LoggerFactory.getLogger(CandidateMatchingServiceImpl.class);
    
    private final AIAnalysisRepository aiAnalysisRepository;
    
    private static final String CV_PARSING = "CV_PARSING";
    private static final String SKILL_MATCHING = "SKILL_MATCHING";
    private static final double SKILL_WEIGHT = 0.6;
    private static final double EXPERIENCE_WEIGHT = 0.25;
    private static final double EDUCATION_WEIGHT = 0.15;
    
    public CandidateMatchingServiceImpl(AIAnalysisRepository aiAnalysisRepository) {
        this.aiAnalysisRepository = aiAnalysisRepository;
    }

    @Override
    public Map<String, Object> matchCandidateToJob(String applicantId, String jobId) {
        List<AIAnalysis> cvAnalyses = aiAnalysisRepository.findAll().stream()
                .filter(analysis -> analysis.getApplicantId().equals(applicantId) 
                        && analysis.getAnalysisType().equals(CV_PARSING))
                .toList();

        if (cvAnalyses.isEmpty()) {
            throw new IllegalStateException("No CV analysis found for applicant " + applicantId);
        }
        
        // Get the latest CV analysis
        AIAnalysis latestCvAnalysis = cvAnalyses.stream()
                .max(Comparator.comparing(AIAnalysis::getCreatedAt))
                .orElseThrow(() -> new IllegalStateException("No CV analysis found"));
        
        // Get job requirements (this would typically come from a job service)
        Map<String, Object> jobRequirements = fetchJobRequirements(jobId);
        
        // Extract applicant skills from CV analysis
        Map<String, String> cvResults = latestCvAnalysis.getResults();
        String applicantSkillsText = cvResults.getOrDefault("skills", "");
        List<String> applicantSkills = applicantSkillsText.isEmpty() ? 
                Collections.emptyList() : 
                Arrays.asList(applicantSkillsText.split("\\s*,\\s*"));
        
        // Extract required skills from job with proper type handling
        List<String> requiredSkills;
        try {
            @SuppressWarnings("unchecked")
            List<String> skills = (List<String>) jobRequirements.getOrDefault("required_skills", Collections.emptyList());
            requiredSkills = skills;
        } catch (ClassCastException e) {
            log.error("Failed to cast required_skills to List<String> for job {}", jobId, e);
            requiredSkills = Collections.emptyList();
        }
        
        // Match skills
        Map<String, String> skillMatching = matchSkills(applicantSkills, requiredSkills);
        
        // Calculate experience match
        String applicantExperienceText = cvResults.getOrDefault("experience", "");
        int requiredYears = (int) jobRequirements.getOrDefault("required_years", 0);
        int estimatedYears = estimateYearsOfExperience(applicantExperienceText);
        boolean experienceMatch = estimatedYears >= requiredYears;
        
        // Calculate education match
        String applicantEducationText = cvResults.getOrDefault("education", "");
        String requiredEducation = (String) jobRequirements.getOrDefault("required_education", "");
        boolean educationMatch = matchesEducationRequirement(applicantEducationText, requiredEducation);
        
        // Calculate overall match score
        double matchScore = calculateMatchScore(skillMatching, requiredSkills, experienceMatch, educationMatch);
        
        // Create result map
        Map<String, String> resultMap = new HashMap<>();
        resultMap.put("matching_skills", String.join(", ", skillMatching.keySet()));
        resultMap.put("missing_skills", String.join(", ", getMissingSkills(requiredSkills, skillMatching.keySet())));
        resultMap.put("experience_match", String.valueOf(experienceMatch));
        resultMap.put("education_match", String.valueOf(educationMatch));
        
        // Create and save analysis
        AIAnalysis matchAnalysis = new AIAnalysis();
        matchAnalysis.setApplicantId(applicantId);
        matchAnalysis.setJobId(jobId);
        matchAnalysis.setAnalysisType(SKILL_MATCHING);
        matchAnalysis.setResults(resultMap);
        matchAnalysis.setConfidenceScore(matchScore);
        aiAnalysisRepository.save(matchAnalysis);
        
        // Return a map with the result details
        Map<String, Object> result = new HashMap<>();
        result.put("match_score", matchScore);
        result.put("details", resultMap);
        return result;
    }
    
    @Override
    public Double calculateCompatibilityScore(String applicantId, String jobId) {
        // Check if we already have a matching analysis
        List<AIAnalysis> matchingAnalyses = aiAnalysisRepository.findAll().stream()
                .filter(analysis -> analysis.getApplicantId().equals(applicantId) 
                        && analysis.getJobId().equals(jobId) 
                        && analysis.getAnalysisType().equals(SKILL_MATCHING))
                .toList();
        
        // Return the confidence score if we have one, otherwise 0.0
        return matchingAnalyses.isEmpty() ? 0.0 : matchingAnalyses.get(0).getConfidenceScore();
    }
    
    private Map<String, Object> fetchJobRequirements(String jobId) {
        if (jobId == null || jobId.isEmpty()) {
            log.error("Invalid job ID provided");
            throw new IllegalArgumentException("Job ID cannot be null or empty");
        }
        
        try {
            // In a real implementation, this would call the job service API
            // For now, we'll return mock data
            Map<String, Object> requirements = new HashMap<>();
            requirements.put("required_skills", Arrays.asList("java", "spring", "hibernate", "sql", "react"));
            requirements.put("required_years", 3);
            requirements.put("required_education", "Bachelor's Degree");
            return requirements;
        } catch (Exception e) {
            log.error("Failed to fetch job requirements for job ID: {}", jobId, e);
            throw new RuntimeException("Failed to fetch job requirements", e);
        }
    }
    
    private Map<String, String> matchSkills(List<String> applicantSkills, List<String> requiredSkills) {
        Map<String, String> matchedSkills = new HashMap<>();
        
        for (String requiredSkill : requiredSkills) {
            String normalizedRequiredSkill = requiredSkill.toLowerCase();
            
            for (String applicantSkill : applicantSkills) {
                String normalizedApplicantSkill = applicantSkill.toLowerCase();
                
                if (normalizedApplicantSkill.contains(normalizedRequiredSkill) || 
                    normalizedRequiredSkill.contains(normalizedApplicantSkill)) {
                    matchedSkills.put(requiredSkill, applicantSkill);
                    break;
                }
            }
        }
        
        return matchedSkills;
    }
    
    private List<String> getMissingSkills(List<String> requiredSkills, Set<String> matchedSkills) {
        List<String> missingSkills = new ArrayList<>();
        
        for (String skill : requiredSkills) {
            if (!matchedSkills.contains(skill)) {
                missingSkills.add(skill);
            }
        }
        
        return missingSkills;
    }
    
    private int estimateYearsOfExperience(String experienceText) {
        if (experienceText == null || experienceText.isEmpty()) {
            return 0;
        }
        
        // Look for explicit years mentioned
        Pattern yearPattern = Pattern.compile("(\\d+)[+]?(?:\\s*-\\s*\\d+)?\\s*years?", Pattern.CASE_INSENSITIVE);
        Matcher yearMatcher = yearPattern.matcher(experienceText);
        
        int explicitYears = 0;
        while (yearMatcher.find()) {
            explicitYears += Integer.parseInt(yearMatcher.group(1));
        }
        
        if (explicitYears > 0) {
            return Math.min(explicitYears, 20); // Return explicit years if found
        }
        
        // Only look for date ranges if no explicit years are found
        Pattern datePattern = Pattern.compile("(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\\s*(\\d{4})\\s*-\\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\\s*(\\d{4}|present)", Pattern.CASE_INSENSITIVE);
        Matcher dateMatcher = datePattern.matcher(experienceText);
        
        Set<Integer> experienceYears = new HashSet<>(); // Use set to avoid double-counting years
        
        while (dateMatcher.find()) {
            int startYear = Integer.parseInt(dateMatcher.group(1));
            String endYearStr = dateMatcher.group(2);
            int endYear;
            
            if (endYearStr.equalsIgnoreCase("present")) {
                endYear = Calendar.getInstance().get(Calendar.YEAR);
            } else {
                endYear = Integer.parseInt(endYearStr);
            }
            
            // Add each year in the range to the set to avoid double counting
            for (int year = startYear; year <= endYear; year++) {
                experienceYears.add(year);
            }
        }
        
        return Math.min(experienceYears.size(), 20); // Cap at 20 years
    }
    
    private boolean matchesEducationRequirement(String applicantEducation, String requiredEducation) {
        if (requiredEducation == null || requiredEducation.isEmpty()) {
            return true; // No specific education required
        }
        
        String normalizedApplicantEdu = applicantEducation.toLowerCase();
        String normalizedRequiredEdu = requiredEducation.toLowerCase();
        
        Map<String, Integer> eduLevels = new HashMap<>();
        eduLevels.put("high school", 1);
        eduLevels.put("associate", 2);
        eduLevels.put("bachelor", 3);
        eduLevels.put("master", 4);
        eduLevels.put("phd", 5);
        eduLevels.put("doctorate", 5);
        
        int requiredLevel = 0;
        int applicantLevel = 0;
        
        for (Map.Entry<String, Integer> entry : eduLevels.entrySet()) {
            if (normalizedRequiredEdu.contains(entry.getKey()) && entry.getValue() > requiredLevel) {
                requiredLevel = entry.getValue();
            }
            
            if (normalizedApplicantEdu.contains(entry.getKey()) && entry.getValue() > applicantLevel) {
                applicantLevel = entry.getValue();
            }
        }
        
        return applicantLevel >= requiredLevel;
    }
    
    private double calculateMatchScore(Map<String, String> matchedSkills, List<String> requiredSkills, 
                                      boolean experienceMatch, boolean educationMatch) {
        double skillScore = requiredSkills.isEmpty() ? 1.0 : (double) matchedSkills.size() / requiredSkills.size();
        
        // Use constants instead of magic numbers
        return (skillScore * SKILL_WEIGHT) + 
               (experienceMatch ? EXPERIENCE_WEIGHT : 0) + 
               (educationMatch ? EDUCATION_WEIGHT : 0);
    }
}