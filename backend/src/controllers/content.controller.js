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

/**
 * Get autocomplete suggestions for search
 */
exports.getAutocompleteSuggestions = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    // Search multiple types in parallel
    const [tvResults, movieResults] = await Promise.all([
      tmdbService.searchContent(query, 'tv', 1).catch(() => ({ results: [] })),
      tmdbService.searchContent(query, 'movie', 1).catch(() => ({ results: [] }))
    ]);

    // Combine and limit results
    const suggestions = [
      ...tvResults.results.slice(0, 5).map(item => ({
        id: item.id,
        title: item.title,
        type: 'tv',
        year: item.releaseDate?.split('-')[0],
        posterPath: item.posterPath
      })),
      ...movieResults.results.slice(0, 5).map(item => ({
        id: item.id,
        title: item.title,
        type: 'movie',
        year: item.releaseDate?.split('-')[0],
        posterPath: item.posterPath
      }))
    ].slice(0, 10); // Limit to 10 total suggestions

    res.json({ suggestions });
  } catch (error) {
    next(error);
  }
};
