#1. Resume Analyzer with Skill Extraction
# This function supports the "AI-Powered Resume Matching" use case (1.3) by extracting skills from resumes.

import spacy
import re
from collections import Counter
from typing import Dict, List, Set, Tuple

class ResumeAnalyzer:
    """
    A service that analyzes resumes to extract skills, experience, and other relevant information
    using NLP techniques.
    """
    
    def __init__(self, skill_keywords_path: str = None):
        """
        Initialize the resume analyzer with optional path to skill keywords
        
        Args:
            skill_keywords_path: Path to file containing skill keywords for enhanced detection
        """
        # Load spaCy NLP model
        self.nlp = spacy.load("en_core_web_md")
        
        # Load skill keywords if provided
        self.skill_keywords = set()
        if skill_keywords_path:
            try:
                with open(skill_keywords_path, 'r') as f:
                    self.skill_keywords = {line.strip().lower() for line in f if line.strip()}
            except Exception as e:
                print(f"Warning: Could not load skill keywords: {e}")
                
        # Common technical skills regex patterns
        self.tech_skill_patterns = [
            r'\b(python|java|javascript|typescript|c\+\+|c#|php|ruby|golang|rust)\b',
            r'\b(react|angular|vue|node\.js|express|django|flask|spring|hibernate)\b',
            r'\b(sql|mysql|postgresql|mongodb|cassandra|oracle|redis|elasticsearch)\b',
            r'\b(aws|azure|gcp|docker|kubernetes|terraform|jenkins|ci/cd)\b',
            r'\b(machine learning|deep learning|nlp|computer vision|data science)\b'
        ]
    
    def extract_skills(self, text: str) -> List[str]:
        """
        Extract skills from resume text using NLP and pattern matching
        
        Args:
            text: The resume text to analyze
            
        Returns:
            List of identified skills
        """
        # Convert to lowercase for case-insensitive matching
        text_lower = text.lower()
        
        # Extract skills using regex patterns
        skills = set()
        for pattern in self.tech_skill_patterns:
            matches = re.findall(pattern, text_lower)
            skills.update(matches)
        
        # Extract skills using keyword matching
        for skill in self.skill_keywords:
            if skill in text_lower:
                skills.add(skill)
        
        # Use NLP for additional skill extraction
        doc = self.nlp(text)
        
        # Look for noun phrases that might be skills
        for chunk in doc.noun_chunks:
            if chunk.text.lower() in self.skill_keywords:
                skills.add(chunk.text.lower())
        
        return list(skills)
    
    def analyze_resume(self, resume_text: str) -> Dict:
        """
        Perform comprehensive analysis of a resume
        
        Args:
            resume_text: The text content of the resume
            
        Returns:
            Dictionary with analysis results including skills and experience
        """
        # Extract skills
        skills = self.extract_skills(resume_text)
        
        # Extract education (simplified approach)
        education = self._extract_education(resume_text)
        
        # Extract work experience (simplified approach)
        experience_years = self._estimate_experience_years(resume_text)
        
        # Generate embeddings for the resume for later matching
        resume_embedding = self.nlp(resume_text).vector
        
        return {
            "skills": skills,
            "education": education,
            "experience_years": experience_years,
            "embedding": resume_embedding
        }
    
    def _extract_education(self, text: str) -> List[str]:
        """Extract education information from resume"""
        education = []
        education_keywords = ["bachelor", "master", "phd", "degree", "diploma", "university", "college"]
        
        # Simple extraction based on sentences containing education keywords
        doc = self.nlp(text)
        for sent in doc.sents:
            sent_lower = sent.text.lower()
            if any(keyword in sent_lower for keyword in education_keywords):
                education.append(sent.text.strip())
        
        return education
    
    def _estimate_experience_years(self, text: str) -> float:
        """Estimate years of experience from resume text"""
        # Look for patterns like "X years of experience"
        experience_patterns = [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
            r'experience\s+(?:of\s+)?(\d+)\+?\s*years?',
            r'worked\s+(?:for\s+)?(\d+)\+?\s*years?'
        ]
        
        years = []
        for pattern in experience_patterns:
            matches = re.findall(pattern, text.lower())
            years.extend([float(y) for y in matches])
        
        if years:
            return max(years)  # Return the highest number of years found
        return 0.0  # Default if no experience years found