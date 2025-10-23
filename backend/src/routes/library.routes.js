const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/library.controller');

// Get all library info
router.get('/', libraryController.getAllLibrary);

// Get top TV shows
router.get('/tv-shows', libraryController.getTopTVShows);

// Get top movies
router.get('/movies', libraryController.getTopMovies);

// Get top streamers
router.get('/streamers', libraryController.getTopStreamers);

module.exports = router;
