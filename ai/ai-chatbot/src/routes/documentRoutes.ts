import express from 'express';
import multer from 'multer';
import { analyzeDocument } from '../services/documentService';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/analyze', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Document file is required' });
    }
    
    const analysis = await analyzeDocument(req.file.path);
    return res.json({ analysis });
  } catch (error) {
    console.error('Error analyzing document:', error);
    return res.status(500).json({ error: 'Failed to analyze document' });
  }
});

export default router;
