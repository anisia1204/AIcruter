import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

// Import routes
import chatRoutes from './routes/chatRoutes';
import voiceRoutes from './routes/voiceRoutes';
import documentRoutes from './routes/documentRoutes';

// Configure environment variables
dotenv.config();

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Configure middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.') as any);
    }
  }
});

// Set up routes
app.use('/api/chat', chatRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/documents', documentRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'AI Chatbot server is running',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/chat',
      'POST /api/documents/analyze',
      'POST /api/documents/parse'
    ]
  });
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  
  socket.on('chat message', (msg) => {
    // Process message and generate response
    // This would integrate with the AI service
    console.log('Message received:', msg);
    
    // Echo back for now, in real app this would call AI service
    socket.emit('chat response', {
      message: `Echo: ${msg.message}`,
      timestamp: new Date().toISOString()
    });
  });
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDirs = ['uploads', 'uploads/documents', 'uploads/voice'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`AI Chatbot server running on port ${PORT}`);
});

export default server;
