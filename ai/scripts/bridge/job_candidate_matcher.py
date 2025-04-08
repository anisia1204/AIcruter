#2. Job-Candidate Matching Function
# This function implements the core job-candidate matching algorithm that calculates similarity scores between job listings and candidate profiles.


import numpy as np
from typing import Dict, List, Optional, Tuple
from sentence_transformers import SentenceTransformer
import spacy

class JobCandidateMatchingService:
    """
    Service that matches job listings with candidates based on skills, experience,
    and semantic similarity using NLP and vector embeddings.
    """
    
    def __init__(self):
        """Initialize the job-candidate matcher with necessary models"""
        # Load sentence transformer model for high-quality text embeddings
        self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Load spaCy for NLP processing
        self.nlp = spacy.load('en_core_web_md')
        
        # Weights for different matching components
        self.weights = {
            "skills_match": 0.4,
            "semantic_similarity": 0.3,
            "experience_match": 0.2,
            "education_match": 0.1
        }
    
    def calculate_match_score(self, 
                             job_listing: Dict, 
                             candidate_profile: Dict) -> Dict:
        """
        Calculate the match score between a job listing and candidate profile
        
        Args:
            job_listing: Dictionary containing job details
            candidate_profile: Dictionary containing candidate details
            
        Returns:
            Dictionary containing overall match score and component scores
        """
        # Calculate individual component scores
        skills_score = self._calculate_skills_match(
            job_listing.get('required_skills', []), 
            candidate_profile.get('skills', [])
        )
        
        semantic_score = self._calculate_semantic_similarity(
            job_listing.get('description', ''),
            candidate_profile.get('resume_text', '')
        )
        
        experience_score = self._calculate_experience_match(
            job_listing.get('min_years_experience', 0),
            candidate_profile.get('experience_years', 0)
        )
        
        education_score = self._calculate_education_match(
            job_listing.get('required_education', ''),
            candidate_profile.get('education', [])
        )
        
        # Calculate weighted overall score
        overall_score = (
            self.weights["skills_match"] * skills_score +
            self.weights["semantic_similarity"] * semantic_score +
            self.weights["experience_match"] * experience_score +
            self.weights["education_match"] * education_score
        )
        
        return {
            "overall_match_score": round(overall_score, 2),
            "skills_score": round(skills_score, 2),
            "semantic_score": round(semantic_score, 2),
            "experience_score": round(experience_score, 2),
            "education_score": round(education_score, 2),
        }
    
    def _calculate_skills_match(self, 
                               required_skills: List[str], 
                               candidate_skills: List[str]) -> float:
        """
        Calculate the match score based on skills
        
        Args:
            required_skills: List of skills required for the job
            candidate_skills: List of skills the candidate has
            
        Returns:
            Match score between 0.0 and 1.0
        """
        if not required_skills:
            return 1.0  # No required skills specified
        
        # Convert to lowercase for case-insensitive comparison
        required_skills_lower = [skill.lower() for skill in required_skills]
        candidate_skills_lower = [skill.lower() for skill in candidate_skills]
        
        # Calculate direct matches
        direct_matches = set(required_skills_lower) & set(candidate_skills_lower)
        direct_match_score = len(direct_matches) / len(required_skills)
        
        # Calculate semantic similarity for skills that don't directly match
        semantic_matches = 0.0
        non_matching_required = [s for s in required_skills_lower if s not in direct_matches]
        
        if non_matching_required and candidate_skills:
            # Create embeddings for non-matching required skills and candidate skills
            req_embeddings = self.sentence_model.encode(non_matching_required)
            cand_embeddings = self.sentence_model.encode(candidate_skills_lower)
            
            # For each non-matching required skill, find the most similar candidate skill
            for req_emb in req_embeddings:
                # Calculate cosine similarity between the required skill and all candidate skills
                similarities = np.dot(cand_embeddings, req_emb) / (
                    np.linalg.norm(cand_embeddings, axis=1) * np.linalg.norm(req_emb)
                )
                # Add the highest similarity score
                if similarities.size > 0:
                    semantic_matches += np.max(similarities)
            
            semantic_match_score = semantic_matches / len(non_matching_required) * 0.8  # Semantic matches are weighted less
        else:
            semantic_match_score = 0.0
        
        # Calculate overall skill match score (direct matches + semantic matches for non-matching skills)
        if len(required_skills) > 0:
            direct_weight = 0.7  # Direct matches have higher weight
            semantic_weight = 0.3  # Semantic matches have lower weight
            
            # Calculate the proportion of direct matches and semantic matches
            direct_proportion = len(direct_matches) / len(required_skills)
            semantic_proportion = 1.0 - direct_proportion
            
            # Overall skill score combines direct and semantic matches
            skill_score = (direct_weight * direct_match_score) + (
                semantic_weight * semantic_match_score * semantic_proportion
            )
            
            return min(1.0, skill_score)  # Cap at 1.0
        
        return 0.0
    
    def _calculate_semantic_similarity(self, 
                                      job_description: str, 
                                      resume_text: str) -> float:
        """
        Calculate semantic similarity between job description and resume text
        
        Args:
            job_description: Job description text
            resume_text: Resume text
            
        Returns:
            Similarity score between 0.0 and 1.0
        """
        if not job_description or not resume_text:
            return 0.0
            
        # Generate embeddings
        job_embedding = self.sentence_model.encode(job_description)
        resume_embedding = self.sentence_model.encode(resume_text)
        
        # Calculate cosine similarity
        similarity = np.dot(job_embedding, resume_embedding) / (
            np.linalg.norm(job_embedding) * np.linalg.norm(resume_embedding)
        )
        
        return float(similarity)
    
    def _calculate_experience_match(self, 
                                   required_years: float, 
                                   candidate_years: float) -> float:
        """
        Calculate experience match score based on years of experience
        
        Args:
            required_years: Years of experience required for the job
            candidate_years: Years of experience the candidate has
            
        Returns:
            Match score between 0.0 and 1.0
        """
        if required_years <= 0:
            return 1.0  # No experience requirement
            
        if candidate_years >= required_years:
            return 1.0  # Candidate meets or exceeds the requirement
            
        # Partial credit for some experience (linear scale)
        return min(1.0, candidate_years / required_years)
    
    def _calculate_education_match(self, 
                                  required_education: str, 
                                  candidate_education: List[str]) -> float:
        """
        Calculate education match score
        
        Args:
            required_education: Education required for the job
            candidate_education: List of candidate's education entries
            
        Returns:
            Match score between 0.0 and 1.0
        """
        if not required_education:
            return 1.0  # No education requirement
            
        if not candidate_education:
            return 0.0  # Candidate has no education listed
            
        # Map education levels to numeric values
        education_levels = {
            "high school": 1,
            "associate": 2,
            "bachelor": 3,
            "master": 4,
            "phd": 5,
            "doctorate": 5
        }
        
        # Determine required education level
        required_level = 0
        for level, value in education_levels.items():
            if level in required_education.lower():
                required_level = value
                break
        
        if required_level == 0:
            return 0.5  # Couldn't determine required level, assign neutral score
        
        # Find highest candidate education level
        candidate_level = 0
        for edu in candidate_education:
            for level, value in education_levels.items():
                if level in edu.lower() and value > candidate_level:
                    candidate_level = value
        
        # Compare levels
        if candidate_level >= required_level:
            return 1.0
        elif candidate_level > 0:
            return candidate_level / required_level  # Partial match
        else:
            return 0.0