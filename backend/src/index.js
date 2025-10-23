const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const multer = require('multer');

let contentRoutes, clipRoutes, uploadRoutes, libraryRoutes;
try {
  contentRoutes = require('./routes/content.routes');
  clipRoutes = require('./routes/clip.routes');
  uploadRoutes = require('./routes/upload.routes');
  libraryRoutes = require('./routes/library.routes');
  console.log('Routes loaded successfully');
} catch (error) {
  console.error('Error loading routes:', error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for processed videos
app.use('/videos', express.static(path.join(__dirname, '../processed')));

// Routes
app.use('/api/content', contentRoutes);
app.use('/api/clips', clipRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/library', libraryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

// Start server
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`Backend server running on http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log('TMDb configured:', !!process.env.TMDB_API_KEY);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

module.exports = app;
