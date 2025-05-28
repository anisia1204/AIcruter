# AIcruter AI Chatbot Server

This is the AI chatbot backend for the AIcruter platform, providing intelligent resume analysis and career assistance.

## Quick Start

**Option 1: One-click startup**
- Double-click `start-ai-server.bat` to automatically install dependencies and start the server

**Option 2: Manual commands**
```bash
cd ai/ai-chatbot
npm install
npm run dev
```

## Configuration

1. Copy `.env.example` to `.env`
2. Add your OpenAI API key to the `.env` file

## API Endpoints

- `POST /api/chat` - Text chat with AI assistant
- `POST /api/documents/analyze` - Analyze uploaded resumes
- `POST /api/documents/parse` - Parse resume data

The server runs on port 5000 by default.
