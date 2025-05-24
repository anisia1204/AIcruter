import express from 'express';
import { processTextChat } from '../services/chatService';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await processTextChat(message, userId);
    return res.json({ response });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return res.status(500).json({ error: 'Failed to process message' });
  }
});

export default router;
