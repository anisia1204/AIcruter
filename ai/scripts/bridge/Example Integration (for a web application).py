from ai.services.resume_analyzer import ResumeAnalyzer
from ai.services.job_candidate_matcher import JobCandidateMatchingService

class JobRecommendationService:
    def __init__(self):
        self.resume_analyzer = ResumeAnalyzer()
        self.matcher = JobCandidateMatchingService()
        
    def get_job_recommendations(self, user_id, count=10):
        """Get personalized job recommendations for a user"""
        # Get user profile and resume from database
        user_profile = self._get_user_profile(user_id)
        resume_text = user_profile.get('resume_text', '')
        
        # Analyze resume with AI
        resume_analysis = self.resume_analyzer.analyze_resume(resume_text)
        
        # Get active job listings from database
        job_listings = self._get_active_job_listings()
        
        # Calculate match scores for each job
        job_scores = []
        for job in job_listings:
            match_score = self.matcher.calculate_match_score(job, {
                'skills': resume_analysis['skills'],
                'experience_years': resume_analysis['experience_years'],
                'education': resume_analysis['education'],
                'resume_text': resume_text
            })
            job_scores.append((job, match_score['overall_match_score']))
        
        # Sort jobs by match score and return top recommendations
        job_scores.sort(key=lambda x: x[1], reverse=True)
        return [{'job': job, 'score': score} for job, score in job_scores[:count]]
    
    def _get_user_profile(self, user_id):
        # Implementation to fetch user profile from database
        pass
        
    def _get_active_job_listings(self):
        # Implementation to fetch active job listings from database
        pass