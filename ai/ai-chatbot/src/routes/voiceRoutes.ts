import express from 'express';
import multer from 'multer';
import { processVoiceInput, generateVoiceResponse } from '../services/voiceService';

const router = express.Router();
const upload = multer({ dest: 'uploads/voice/' });

router.post('/speech-to-text', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }
    
    const text = await processVoiceInput(req.file.path);
    return res.json({ text });
  } catch (error) {
    console.error('Error processing voice input:', error);
    return res.status(500).json({ error: 'Failed to process voice input' });
  }
});

router.post('/text-to-speech', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const audioBuffer = await generateVoiceResponse(text);
    
    res.set('Content-Type', 'audio/mpeg');
    return res.send(audioBuffer);
  } catch (error) {
    console.error('Error generating voice response:', error);
    return res.status(500).json({ error: 'Failed to generate voice response' });
  }
});

export default router;
