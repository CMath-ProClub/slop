const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');

// Get autocomplete suggestions (must be before search to avoid route conflict)
router.get('/autocomplete', contentController.getAutocompleteSuggestions);

// Search for content (TV shows, movies, streamers)
router.get('/search', contentController.searchContent);

// Get detailed information about specific content
router.get('/:id', contentController.getContentDetails);

// Get episodes for a TV show season
router.get('/:id/season/:seasonNumber', contentController.getSeasonEpisodes);

module.exports = router;
