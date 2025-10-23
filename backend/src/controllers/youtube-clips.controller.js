const youtubeSearchService = require('../services/youtube-search.service');

/**
 * Search for YouTube clips related to content
 */
exports.searchClips = async (req, res, next) => {
  try {
    const { query, maxResults = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await youtubeSearchService.searchYouTubeClips(query, maxResults);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

/**
 * Get details about a specific YouTube video
 */
exports.getClipDetails = async (req, res, next) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    const details = await youtubeSearchService.getVideoDetails(videoId);
    res.json(details);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchClips,
  getClipDetails
};
