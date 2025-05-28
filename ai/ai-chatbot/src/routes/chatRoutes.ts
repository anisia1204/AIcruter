import express from 'express';
import { processWithAI, processTextChat } from '../services/chatService';

const router = express.Router();

// Process chat messages
router.post('/', async (req, res) => {
  try {
    console.log('Chat endpoint hit', req.body);
    
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
      console.log('Processing message from user', userId || 'anonymous');
    const response = await processTextChat(message, userId);
    console.log('AI response generated successfully');
    
    return res.json({ 
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Failed to process message', details: errorMessage });
  }
});

// Health check for chat service
router.get('/health', (req, res) => {
  res.json({ 
    status: 'Chat service is operational',
    timestamp: new Date().toISOString()
  });
});

export default router;
