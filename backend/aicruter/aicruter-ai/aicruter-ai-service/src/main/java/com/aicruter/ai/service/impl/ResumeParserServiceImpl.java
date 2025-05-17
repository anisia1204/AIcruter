package com.aicruter.ai.service.impl;

import com.aicruter.ai.domain.entity.AIAnalysis;
import com.aicruter.ai.domain.entity.AIModel;
import com.aicruter.ai.domain.repository.AIAnalysisRepository;
import com.aicruter.ai.domain.repository.AIModelRepository;
import com.aicruter.ai.service.ResumeParserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeParserServiceImpl implements ResumeParserService {

    private final AIAnalysisRepository aiAnalysisRepository;
    private final AIModelRepository aiModelRepository;
    
    // Common skills patterns to detect in resume
    private static final String[] COMMON_SKILLS = {
        "java", "python", "javascript", "c\\+\\+", "c#", "react", "angular",
        "node.js", "aws", "azure", "docker", "kubernetes", "spring", "hibernate",
        "sql", "nosql", "mongodb", "cassandra", "redis", "kafka", "spark",
        "machine learning", "deep learning", "artificial intelligence", "natural language processing",
        "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "data science"
    };
    
    @Override
    public Map<String, Object> parseResume(InputStream fileStream, String fileName) {
        try {
            String fileExtension = getFileExtension(fileName);
            String content = extractTextFromFile(fileStream, fileExtension);
            
            Map<String, Object> analysisResult = new HashMap<>();
            analysisResult.put("content", content);
            analysisResult.put("skills", extractSkills(content));
            analysisResult.put("education", extractEducation(content));
            analysisResult.put("experience", extractExperience(content));
            
            // Store analysis result in the database
            saveAnalysisToDatabase(analysisResult, fileName);
            
            return analysisResult;
        } catch (IOException e) {
            log.error("Failed to parse resume file: {}", fileName, e);
            throw new RuntimeException("Resume parsing failed: " + e.getMessage(), e);
        }
    }
    
    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex > 0) {
            return fileName.substring(lastDotIndex + 1).toLowerCase();
        }
        throw new IllegalArgumentException("Invalid file name: " + fileName);
    }
    
    private String extractTextFromFile(InputStream fileStream, String fileExtension) throws IOException {
        switch (fileExtension) {
            case "pdf":
                return extractTextFromPdf(fileStream);
            case "docx":
                return extractTextFromDocx(fileStream);
            default:
                throw new IllegalArgumentException("Unsupported file format: " + fileExtension);
        }
    }
    
    private String extractTextFromPdf(InputStream pdfStream) throws IOException {
        try (PDDocument document = PDDocument.load(pdfStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
    
    private String extractTextFromDocx(InputStream docxStream) throws IOException {
        try (XWPFDocument document = new XWPFDocument(docxStream)) {
            XWPFWordExtractor extractor = new XWPFWordExtractor(document);
            return extractor.getText();
        }
    }
    
    private List<String> extractSkills(String content) {
        List<String> foundSkills = new ArrayList<>();
        String normalizedContent = content.toLowerCase();
        
        for (String skill : COMMON_SKILLS) {
            Pattern pattern = Pattern.compile("\\b" + skill + "\\b", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(normalizedContent);
            
            if (matcher.find()) {
                // Remove escape characters for display
                foundSkills.add(skill.replaceAll("\\\\", ""));
            }
        }
        
        return foundSkills;
    }
    
    private List<String> extractEducation(String content) {
        List<String> education = new ArrayList<>();
        
        // Look for education-related sections
        Pattern eduPattern = Pattern.compile(
            "(?i)(?:education|university|college|bachelor|master|phd|degree)[^\\n.]{3,100}",
            Pattern.MULTILINE
        );
        
        Matcher matcher = eduPattern.matcher(content);
        while (matcher.find()) {
            education.add(matcher.group().trim());
        }
        
        return education;
    }
    
    private List<String> extractExperience(String content) {
        List<String> experience = new ArrayList<>();
        
        // Look for work experience sections
        Pattern expPattern = Pattern.compile(
            "(?i)(?:experience|work|employment|position|job)[^\\n.]{3,100}",
            Pattern.MULTILINE
        );
        
        Matcher matcher = expPattern.matcher(content);
        while (matcher.find()) {
            experience.add(matcher.group().trim());
        }
        
        return experience;
    }
    
    private void saveAnalysisToDatabase(Map<String, Object> analysisResult, String fileName) {
        try {
            // Get the latest AI model
            Optional<AIModel> modelOpt = aiModelRepository.findFirstByOrderByCreatedDateDesc();
            
            if (modelOpt.isPresent()) {
                AIModel model = modelOpt.get();
                
                AIAnalysis analysis = new AIAnalysis();
                analysis.setFileName(fileName);
                analysis.setRawContent((String) analysisResult.get("content"));
                analysis.setExtractedSkills(String.join(", ", (List<String>) analysisResult.get("skills")));
                analysis.setModel(model);
                analysis.setCreatedDate(new Date());
                
                aiAnalysisRepository.save(analysis);
                log.info("Analysis saved for file: {}", fileName);
            } else {
                log.warn("No AI model found for analysis");
            }
        } catch (Exception e) {
            log.error("Failed to save analysis to database", e);
        }
    }
}