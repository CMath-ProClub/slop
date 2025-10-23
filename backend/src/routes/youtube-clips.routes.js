const express = require('express');
const router = express.Router();
const youtubeClipsController = require('../controllers/youtube-clips.controller');

// Search for YouTube clips
router.get('/search', youtubeClipsController.searchClips);

// Get specific video details
router.get('/:videoId', youtubeClipsController.getClipDetails);

module.exports = router;
