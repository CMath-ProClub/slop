const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');

// Upload to YouTube Shorts
router.post('/youtube', uploadController.uploadToYouTube);

// Get YouTube OAuth URL
router.get('/youtube/auth-url', uploadController.getYouTubeAuthUrl);

// YouTube OAuth callback
router.get('/youtube/callback', uploadController.youtubeCallback);

// Upload to TikTok
router.post('/tiktok', uploadController.uploadToTikTok);

// Get TikTok OAuth URL
router.get('/tiktok/auth-url', uploadController.getTikTokAuthUrl);

module.exports = router;
