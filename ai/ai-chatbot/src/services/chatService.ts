import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
});

/**
 * Process a text chat message using AI
 */
export async function processWithAI(message: string, userId?: string): Promise<string> {  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are AIcruter's professional career assistant. You help with:
- Resume analysis and improvement
- Job search strategies
- Interview preparation
- Career advice
- Skill development recommendations

You are knowledgeable, supportive, and professional. Keep responses concise but helpful.
Always encourage users to upload their resumes for detailed analysis.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return completion.choices[0]?.message?.content || "I'm here to help with your career journey!";
  } catch (error) {
    console.warn('AI chat failed, using fallback:', error);
    return "Sorry, I'm having trouble connecting to my AI services. I'm still here to help with your career journey!";
  }
}

/**
 * Process a text chat message and generate a response
 * @param message The user's message
 * @param userId Optional user ID for personalization
 * @returns AI-generated response
 */
export async function processTextChat(message: string, userId?: string): Promise<string> {
  // Try AI response first if configured
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
    const aiResponse = await processWithAI(message, userId);
    if (aiResponse) return aiResponse;
  }
  
  // Fallback to rule-based responses
  const lowerMessage = message.toLowerCase();
  
  // Simple pattern matching for demo purposes
  if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
    return "I can help you improve your resume! 📄 Upload your CV using the document button below for detailed analysis including:\n\n🎯 **Resume Score** - Get a percentage score with breakdown\n🔍 **Resume Parsing** - Extract structured data from your resume\n\nI can also provide general resume tips and best practices.";
  }
  
  if (lowerMessage.includes('job') || lowerMessage.includes('work') || lowerMessage.includes('employment')) {
    return "Looking for job opportunities? 💼 I can help you:\n\n• Search for relevant positions based on your skills\n• Analyze job requirements vs your resume\n• Provide job search strategies\n• Recommend skills to develop\n\nUpload your resume first so I can give personalized job recommendations!";
  }
  
  if (lowerMessage.includes('interview') || lowerMessage.includes('preparation')) {
    return "Interview preparation is key to success! 🎯 I can help with:\n\n• Common interview questions for your field\n• Tips for behavioral interviews\n• Technical interview preparation\n• Salary negotiation strategies\n\nWhat type of role are you interviewing for?";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! 👋 I'm AIcruter's AI assistant. I'm here to help with your career journey!\n\n🚀 **What I can do:**\n• Analyze and score your resume\n• Extract structured data from CVs\n• Provide job search advice\n• Help with interview preparation\n• Recommend career improvements\n\n📄 **Get started:** Upload your resume using the document button below!";
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return "I'm your AI career assistant! 🤖 Here's how I can help:\n\n📊 **Resume Analysis**\n• Upload your CV for detailed scoring\n• Get improvement suggestions\n• Extract structured data\n\n💼 **Job Search**\n• Personalized job recommendations\n• Skill gap analysis\n• Application strategies\n\n🎯 **Interview Prep**\n• Practice questions\n• Tips and strategies\n\nTry uploading your resume to get started!";
  }
  
  // Default response
  return "I'm here to help with your career development! 🚀\n\nYou can ask me about:\n• Resume improvement\n• Job searching strategies\n• Interview preparation\n• Career advice\n\nOr upload your resume using the document button for detailed analysis!";
}
