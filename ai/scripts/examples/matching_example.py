from ai.services.resume_analyzer import ResumeAnalyzer
from ai.services.job_candidate_matcher import JobCandidateMatchingService

def demonstrate_ai_matching():
    # Initialize services
    analyzer = ResumeAnalyzer()
    matcher = JobCandidateMatchingService()
    
    # Example job listing
    job_listing = {
        "title": "Senior Software Engineer",
        "description": "We are looking for a Senior Software Engineer with strong experience in Java and Spring Boot. The ideal candidate should have knowledge of microservices architecture and cloud platforms like AWS.",
        "required_skills": ["Java", "Spring Boot", "Microservices", "AWS", "REST API"],
        "min_years_experience": 5,
        "required_education": "Bachelor's degree in Computer Science or related field"
    }
    
    # Example resume text
    resume_text = """
    JOHN DOE
    Software Engineer with 6 years of experience
    
    SKILLS
    - Java, Spring Boot, Spring MVC
    - Microservice architecture design and implementation
    - AWS (EC2, S3, Lambda, ECS)
    - RESTful API design
    - Docker, Kubernetes
    
    EXPERIENCE
    Senior Developer, Tech Corp (2018-Present)
    - Designed and implemented microservices using Spring Boot
    - Deployed applications to AWS using Docker containers
    - Led a team of 3 developers working on the customer-facing API
    
    Software Engineer, Software Inc (2015-2018)
    - Developed Java applications using Spring framework
    - Implemented RESTful services for mobile applications
    
    EDUCATION
    Bachelor of Science in Computer Science
    University of Technology (2011-2015)
    """
    
    # Analyze resume
    resume_analysis = analyzer.analyze_resume(resume_text)
    
    # Create candidate profile from analysis
    candidate_profile = {
        "skills": resume_analysis["skills"],
        "experience_years": resume_analysis["experience_years"],
        "education": resume_analysis["education"],
        "resume_text": resume_text
    }
    
    # Calculate match score
    match_result = matcher.calculate_match_score(job_listing, candidate_profile)
    
    # Print results
    print("Resume Analysis:")
    print(f"- Skills: {', '.join(resume_analysis['skills'])}")
    print(f"- Experience: {resume_analysis['experience_years']} years")
    print(f"- Education: {resume_analysis['education']}")
    print("\nMatch Score Results:")
    print(f"- Overall Match Score: {match_result['overall_match_score']}")
    print(f"- Skills Score: {match_result['skills_score']}")
    print(f"- Semantic Score: {match_result['semantic_score']}")
    print(f"- Experience Score: {match_result['experience_score']}")
    print(f"- Education Score: {match_result['education_score']}")

if __name__ == "__main__":
    demonstrate_ai_matching()