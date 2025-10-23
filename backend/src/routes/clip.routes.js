const express = require('express');
const router = express.Router();
const clipController = require('../controllers/clip.controller');
const multer = require('multer');
const path = require('path');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.VIDEO_UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only video files are allowed.'));
  }
});

// Create a new clip from content
router.post('/create', clipController.createClip);

// Upload user's own video for processing
router.post('/upload', upload.single('video'), clipController.uploadAndProcess);

// Get clip status
router.get('/:clipId/status', clipController.getClipStatus);

// Download processed clip
router.get('/:clipId/download', clipController.downloadClip);

// Get all clips for user (if auth is implemented)
router.get('/user/:userId', clipController.getUserClips);

module.exports = router;
