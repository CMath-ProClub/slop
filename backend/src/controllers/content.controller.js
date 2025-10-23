const tmdbService = require('../services/tmdb.service');

/**
 * Search for content (TV shows, movies)
 */
exports.searchContent = async (req, res, next) => {
  try {
    const { query, type = 'multi', page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await tmdbService.searchContent(query, type, page);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed information about specific content
 */
exports.getContentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type = 'tv' } = req.query;

    const details = await tmdbService.getContentDetails(id, type);
    res.json(details);
  } catch (error) {
    next(error);
  }
};

/**
 * Get episodes for a specific season
 */
exports.getSeasonEpisodes = async (req, res, next) => {
  try {
    const { id, seasonNumber } = req.params;

    const episodes = await tmdbService.getSeasonEpisodes(id, seasonNumber);
    res.json(episodes);
  } catch (error) {
    next(error);
  }
};
