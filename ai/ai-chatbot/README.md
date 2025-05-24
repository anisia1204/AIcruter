# AI Chatbot for AIcruter

This is the backend service for the AI chatbot used in the AIcruter platform. It processes user inputs from text, voice, and document uploads to provide intelligent responses and assistance with job applications and resume analysis.

## Features

- Natural language processing for text conversations
- Speech-to-text and text-to-speech capabilities
- Document analysis for resumes and CVs
- Integration with the main AIcruter platform

## Setup and Running Instructions

1. Navigate to the chatbot directory:
   ```bash
   cd ai/ai-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy the example file: `cp .env.example .env`
   - Edit the `.env` file and set the necessary API keys and service connections

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For production deployment:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

- `POST /api/chat` - Text chat interactions
- `POST /api/voice` - Process voice input and generate voice responses
- `POST /api/document` - Analyze uploaded documents (resumes, CVs)

## Integration with AIcruter Platform

This service is designed to work seamlessly with the main AIcruter platform while maintaining its separation for easier maintenance and scaling.
