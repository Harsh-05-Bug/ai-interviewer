require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { featureCheck } = require('./middleware/featureCheck');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Rate limiters
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const claudeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/interview', claudeLimiter, require('./routes/interview'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api', require('./routes/code'));
app.use('/api/questions', featureCheck('questions'), require('./routes/questions'));
app.use('/api/contact', featureCheck('contact'), require('./routes/contact'));
app.use('/api/reviews', featureCheck('reviews'), require('./routes/reviews'));
app.use('/api/forum', featureCheck('forum'), require('./routes/forum'));
app.use('/api/study-groups', featureCheck('studyrooms'), require('./routes/studyGroups'));
app.use('/api/admin-panel', require('./routes/adminPanel'));

// Health check
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'OK',
    message: 'AI Interviewer backend is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Production static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Create HTTP server + Socket.io
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }
});

// Socket.io — Voice call signaling
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-voice', (roomId) => {
    socket.join(`voice-${roomId}`);
    const clients = Array.from(io.sockets.adapter.rooms.get(`voice-${roomId}`) || []);
    socket.emit('voice-users', clients.filter(id => id !== socket.id));
    socket.to(`voice-${roomId}`).emit('user-joined-voice', socket.id);
    console.log(`${socket.id} joined voice room ${roomId} (${clients.length} users)`);
  });

  socket.on('leave-voice', (roomId) => {
    socket.leave(`voice-${roomId}`);
    socket.to(`voice-${roomId}`).emit('user-left-voice', socket.id);
    console.log(`${socket.id} left voice room ${roomId}`);
  });

  socket.on('offer', ({ to, offer }) => {
    io.to(to).emit('offer', { from: socket.id, offer });
  });

  socket.on('answer', ({ to, answer }) => {
    io.to(to).emit('answer', { from: socket.id, answer });
  });

  socket.on('ice-candidate', ({ to, candidate }) => {
    io.to(to).emit('ice-candidate', { from: socket.id, candidate });
  });

  socket.on('end-call', (roomId) => {
    socket.to(`voice-${roomId}`).emit('call-ended', socket.id);
  });

  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (room.startsWith('voice-')) {
        socket.to(room).emit('user-left-voice', socket.id);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Start server
const { MODEL } = require('./helpers/claude');
httpServer.listen(PORT, () => {
  console.log(`\n🚀 AI Interviewer Server running → http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 Model: ${MODEL}`);
  console.log(`🔌 Socket.io ready for voice calls\n`);
});