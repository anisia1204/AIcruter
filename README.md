# AIcruter
The AI-powered job recruitment platform connects job seekers with employers by using AI to match resumes with job listings.

# Use Cases for AIcruter Platform

## 1. **Employer Use Cases**

### 1.0 Register / Login as an Employer for a Company

### 1.1 Post a Job Listing
**Actors:** Employer
**Description:** Employers create and post job listings with required skills and qualifications.  

### 1.2 Review Job Applications
**Actors:** Employer
**Description:** Employers review and manage applications received for a job listing.

### 1.3 AI-Powered Resume Matching
**Actors:** Employer, AI System
**Description:** AI analyzes resumes and ranks candidates based on job relevance.

### 1.4 Review potential candidates

### 1.5 Create & Manage company profile

## 2. **Job Seeker Use Cases**

### 2.1 Create and Manage Profile
**Actors:** Job Seeker
**Description:** Job seekers create profiles, upload resumes, and edit personal details.  

### 2.2 Apply for a Job
**Actors:** Job Seeker
**Description:** Job seekers browse and apply for job postings.

### 2.3 AI Job Recommendations
**Actors:** Job Seeker, AI System
**Description:** AI suggests job listings based on resume analysis.

### 2.4 Receive Job Status Notifications
**Actors:** Job Seeker
**Description:** Job seekers get notified about application updates.



## Running the Application

### Backend

cd backend\aicruter
mvn clean 
mvn install
mvn spring-boot:run -pl aicruter-web


### AI Chatbot

cd ai/ai-chatbot
npm install
npm run dev



### Frontend

cd web
npm install
npm run dev
