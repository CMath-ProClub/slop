const tmdbService = require('../services/tmdb.service');

/**
 * Media Library Controller
 * Provides curated lists of popular content
 */

// Cache for popular content (refresh every 24 hours)
let cache = {
  tvShows: { data: null, lastFetch: null },
  movies: { data: null, lastFetch: null }
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get top 500 TV shows
 */
exports.getTopTVShows = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    // Check cache
    if (cache.tvShows.data && 
        cache.tvShows.lastFetch && 
        Date.now() - cache.tvShows.lastFetch < CACHE_DURATION) {
      return res.json(paginateResults(cache.tvShows.data, page, limit));
    }

    // Fetch top 500 shows (TMDb returns 20 per page, so we need 25 pages)
    console.log('Fetching top TV shows from TMDb...');
    const allShows = [];
    
    // Fetch first 25 pages to get ~500 shows
    for (let i = 1; i <= 25; i++) {
      const result = await tmdbService.discoverTVShows({ page: i });
      allShows.push(...result.results);
      
      // Add a small delay to avoid rate limiting
      if (i < 25) await new Promise(resolve => setTimeout(resolve, 100));
    }

    cache.tvShows = {
      data: allShows,
      lastFetch: Date.now()
    };

    res.json(paginateResults(allShows, page, limit));
  } catch (error) {
    console.error('Error fetching top TV shows:', error);
    res.status(500).json({ 
      error: 'Failed to fetch top TV shows',
      message: error.message 
    });
  }
};

/**
 * Get top 1000 movies
 */
exports.getTopMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    // Check cache
    if (cache.movies.data && 
        cache.movies.lastFetch && 
        Date.now() - cache.movies.lastFetch < CACHE_DURATION) {
      return res.json(paginateResults(cache.movies.data, page, limit));
    }

    // Fetch top 1000 movies (50 pages × 20 results)
    console.log('Fetching top movies from TMDb...');
    const allMovies = [];
    
    // Fetch first 50 pages to get ~1000 movies
    for (let i = 1; i <= 50; i++) {
      const result = await tmdbService.discoverMovies({ page: i });
      allMovies.push(...result.results);
      
      // Add a small delay to avoid rate limiting
      if (i < 50) await new Promise(resolve => setTimeout(resolve, 100));
    }

    cache.movies = {
      data: allMovies,
      lastFetch: Date.now()
    };

    res.json(paginateResults(allMovies, page, limit));
  } catch (error) {
    console.error('Error fetching top movies:', error);
    res.status(500).json({ 
      error: 'Failed to fetch top movies',
      message: error.message 
    });
  }
};

/**
 * Get top 100 streamers/content creators
 */
exports.getTopStreamers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    // Popular streamers/content creators (you can add more)
    const streamers = [
      { id: 1, name: "MrBeast", platform: "YouTube", category: "Entertainment", subscribers: "200M+" },
      { id: 2, name: "PewDiePie", platform: "YouTube", category: "Gaming/Commentary", subscribers: "111M+" },
      { id: 3, name: "xQc", platform: "Twitch", category: "Gaming/Variety", followers: "12M+" },
      { id: 4, name: "Ninja", platform: "Twitch/YouTube", category: "Gaming", followers: "24M+" },
      { id: 5, name: "Pokimane", platform: "Twitch", category: "Gaming/Variety", followers: "9M+" },
      { id: 6, name: "Kai Cenat", platform: "Twitch", category: "Variety", followers: "13M+" },
      { id: 7, name: "Valkyrae", platform: "YouTube", category: "Gaming", subscribers: "4M+" },
      { id: 8, name: "TimTheTatman", platform: "YouTube", category: "Gaming", subscribers: "4M+" },
      { id: 9, name: "Shroud", platform: "Twitch/YouTube", category: "Gaming", followers: "10M+" },
      { id: 10, name: "Sykkuno", platform: "Twitch/YouTube", category: "Gaming", followers: "4M+" },
      { id: 11, name: "Markiplier", platform: "YouTube", category: "Gaming/Comedy", subscribers: "36M+" },
      { id: 12, name: "Jacksepticeye", platform: "YouTube", category: "Gaming/Comedy", subscribers: "30M+" },
      { id: 13, name: "Dream", platform: "YouTube", category: "Minecraft", subscribers: "31M+" },
      { id: 14, name: "TommyInnit", platform: "YouTube/Twitch", category: "Minecraft", subscribers: "14M+" },
      { id: 15, name: "GeorgeNotFound", platform: "YouTube", category: "Minecraft", subscribers: "10M+" },
      { id: 16, name: "Sapnap", platform: "YouTube/Twitch", category: "Minecraft", subscribers: "4M+" },
      { id: 17, name: "Karl Jacobs", platform: "YouTube/Twitch", category: "Gaming", subscribers: "4M+" },
      { id: 18, name: "Quackity", platform: "YouTube/Twitch", category: "Gaming", subscribers: "6M+" },
      { id: 19, name: "Tubbo", platform: "Twitch", category: "Minecraft", followers: "5M+" },
      { id: 20, name: "Ranboo", platform: "Twitch", category: "Minecraft", followers: "4M+" },
      { id: 21, name: "HasanAbi", platform: "Twitch", category: "Commentary", followers: "2M+" },
      { id: 22, name: "Mizkif", platform: "Twitch", category: "Variety", followers: "2M+" },
      { id: 23, name: "Sodapoppin", platform: "Twitch", category: "Variety", followers: "9M+" },
      { id: 24, name: "Summit1g", platform: "Twitch", category: "Gaming", followers: "6M+" },
      { id: 25, name: "Lirik", platform: "Twitch", category: "Gaming", followers: "3M+" },
      { id: 26, name: "DrLupo", platform: "YouTube", category: "Gaming", subscribers: "2M+" },
      { id: 27, name: "CourageJD", platform: "YouTube", category: "Gaming", subscribers: "3M+" },
      { id: 28, name: "LazarBeam", platform: "YouTube", category: "Gaming", subscribers: "21M+" },
      { id: 29, name: "Fresh", platform: "YouTube", category: "Gaming", subscribers: "9M+" },
      { id: 30, name: "Lachlan", platform: "YouTube", category: "Gaming", subscribers: "15M+" },
      { id: 31, name: "SSundee", platform: "YouTube", category: "Gaming", subscribers: "21M+" },
      { id: 32, name: "CoryxKenshin", platform: "YouTube", category: "Gaming", subscribers: "17M+" },
      { id: 33, name: "DanTDM", platform: "YouTube", category: "Gaming", subscribers: "28M+" },
      { id: 34, name: "Jelly", platform: "YouTube", category: "Gaming", subscribers: "24M+" },
      { id: 35, name: "Slogo", platform: "YouTube", category: "Gaming", subscribers: "15M+" },
      { id: 36, name: "Crainer", platform: "YouTube", category: "Gaming", subscribers: "8M+" },
      { id: 37, name: "Preston", platform: "YouTube", category: "Gaming", subscribers: "14M+" },
      { id: 38, name: "Unspeakable", platform: "YouTube", category: "Minecraft", subscribers: "15M+" },
      { id: 39, name: "Aphmau", platform: "YouTube", category: "Gaming", subscribers: "17M+" },
      { id: 40, name: "PopularMMOs", platform: "YouTube", category: "Minecraft", subscribers: "17M+" },
      { id: 41, name: "Technoblade", platform: "YouTube", category: "Minecraft", subscribers: "15M+" },
      { id: 42, name: "Wilbur Soot", platform: "YouTube", category: "Gaming/Music", subscribers: "6M+" },
      { id: 43, name: "Philza", platform: "YouTube/Twitch", category: "Minecraft", subscribers: "3M+" },
      { id: 44, name: "FaZe Rug", platform: "YouTube", category: "Vlogs/Gaming", subscribers: "25M+" },
      { id: 45, name: "FaZe Adapt", platform: "YouTube", category: "Gaming", subscribers: "6M+" },
      { id: 46, name: "FaZe Apex", platform: "YouTube", category: "Gaming", subscribers: "7M+" },
      { id: 47, name: "Typical Gamer", platform: "YouTube", category: "Gaming", subscribers: "14M+" },
      { id: 48, name: "Tfue", platform: "YouTube/Twitch", category: "Gaming", subscribers: "12M+" },
      { id: 49, name: "Clix", platform: "Twitch", category: "Gaming", followers: "7M+" },
      { id: 50, name: "Bugha", platform: "Twitch", category: "Gaming", followers: "5M+" },
      { id: 51, name: "SypherPK", platform: "YouTube/Twitch", category: "Gaming", subscribers: "6M+" },
      { id: 52, name: "Nick Eh 30", platform: "YouTube", category: "Gaming", subscribers: "4M+" },
      { id: 53, name: "Myth", platform: "YouTube", category: "Gaming", subscribers: "5M+" },
      { id: 54, name: "Loserfruit", platform: "YouTube", category: "Gaming", subscribers: "4M+" },
      { id: 55, name: "Muselk", platform: "YouTube", category: "Gaming", subscribers: "10M+" },
      { id: 56, name: "BasicallyIDoWrk", platform: "YouTube", category: "Gaming", subscribers: "3M+" },
      { id: 57, name: "VanossGaming", platform: "YouTube", category: "Gaming", subscribers: "25M+" },
      { id: 58, name: "H2ODelirious", platform: "YouTube", category: "Gaming", subscribers: "13M+" },
      { id: 59, name: "Daithi De Nogla", platform: "YouTube", category: "Gaming", subscribers: "7M+" },
      { id: 60, name: "Moo Snuckel", platform: "YouTube", category: "Gaming", subscribers: "2M+" },
      { id: 61, name: "Ludwig", platform: "YouTube", category: "Variety", subscribers: "6M+" },
      { id: 62, name: "Valkyrae", platform: "YouTube", category: "Gaming", subscribers: "4M+" },
      { id: 63, name: "Corpse Husband", platform: "YouTube", category: "Gaming", subscribers: "8M+" },
      { id: 64, name: "Disguised Toast", platform: "YouTube", category: "Gaming", subscribers: "4M+" },
      { id: 65, name: "Fuslie", platform: "YouTube", category: "Gaming", subscribers: "1M+" },
      { id: 66, name: "QuarterJade", platform: "Twitch", category: "Gaming", followers: "1M+" },
      { id: 67, name: "Masayoshi", platform: "Twitch", category: "Gaming", followers: "500K+" },
      { id: 68, name: "Abe", platform: "Twitch", category: "Gaming", followers: "300K+" },
      { id: 69, name: "Scarra", platform: "Twitch", category: "Gaming", followers: "2M+" },
      { id: 70, name: "Michael Reeves", platform: "YouTube", category: "Tech/Comedy", subscribers: "7M+" },
      { id: 71, name: "LilyPichu", platform: "YouTube/Twitch", category: "Gaming/Music", subscribers: "3M+" },
      { id: 72, name: "Yvonnie", platform: "Twitch", category: "Variety", followers: "700K+" },
      { id: 73, name: "DrDisrespect", platform: "YouTube", category: "Gaming", subscribers: "4M+" },
      { id: 74, name: "NICKMERCS", platform: "YouTube", category: "Gaming", subscribers: "4M+" },
      { id: 75, name: "AriaSaki", platform: "Twitch", category: "Variety", followers: "1M+" },
      { id: 76, name: "Emiru", platform: "Twitch", category: "Gaming/Cosplay", followers: "1M+" },
      { id: 77, name: "Nmplol", platform: "Twitch", category: "Variety", followers: "2M+" },
      { id: 78, name: "Malena", platform: "Twitch", category: "Variety", followers: "500K+" },
      { id: 79, name: "Alinity", platform: "Twitch", category: "Variety", followers: "1M+" },
      { id: 80, name: "Amouranth", platform: "Twitch", category: "Variety", followers: "6M+" },
      { id: 81, name: "Ibai", platform: "Twitch", category: "Variety", followers: "13M+" },
      { id: 82, name: "AuronPlay", platform: "Twitch", category: "Variety", followers: "15M+" },
      { id: 83, name: "Rubius", platform: "Twitch", category: "Gaming", followers: "15M+" },
      { id: 84, name: "ElSpreen", platform: "Twitch", category: "Gaming", followers: "7M+" },
      { id: 85, name: "Luzu", platform: "Twitch", category: "Variety", followers: "4M+" },
      { id: 86, name: "IlloJuan", platform: "Twitch", category: "Variety", followers: "3M+" },
      { id: 87, name: "ElMariana", platform: "Twitch", category: "Gaming", followers: "3M+" },
      { id: 88, name: "Rivers", platform: "Twitch", category: "Gaming", followers: "2M+" },
      { id: 89, name: "Shadoune666", platform: "YouTube", category: "Minecraft", subscribers: "6M+" },
      { id: 90, name: "ElRichMC", platform: "YouTube", category: "Minecraft", subscribers: "4M+" },
      { id: 91, name: "Farfadox", platform: "Twitch", category: "Gaming", followers: "2M+" },
      { id: 92, name: "Grefg", platform: "Twitch", category: "Gaming", followers: "11M+" },
      { id: 93, name: "Mixwell", platform: "Twitch", category: "Gaming", followers: "2M+" },
      { id: 94, name: "Reven", platform: "Twitch", category: "Gaming", followers: "1M+" },
      { id: 95, name: "Cristinini", platform: "Twitch", category: "Variety", followers: "2M+" },
      { id: 96, name: "KarenSisz", platform: "Twitch", category: "Variety", followers: "500K+" },
      { id: 97, name: "Carola", platform: "Twitch", category: "Variety", followers: "1M+" },
      { id: 98, name: "Arigameplays", platform: "YouTube", category: "Gaming", subscribers: "3M+" },
      { id: 99, name: "Nimu", platform: "Twitch", category: "Variety", followers: "2M+" },
      { id: 100, name: "Zeling", platform: "Twitch", category: "Variety", followers: "1M+" }
    ];

    res.json(paginateResults(streamers, page, limit));
  } catch (error) {
    console.error('Error fetching streamers:', error);
    res.status(500).json({ 
      error: 'Failed to fetch streamers',
      message: error.message 
    });
  }
};

/**
 * Get all library content in one response
 */
exports.getAllLibrary = async (req, res) => {
  try {
    res.json({
      message: 'Use specific endpoints for each category',
      endpoints: {
        tvShows: '/api/content/library/tv-shows',
        movies: '/api/content/library/movies',
        streamers: '/api/content/library/streamers'
      },
      totals: {
        tvShows: 500,
        movies: 1000,
        streamers: 100
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Helper function to paginate results
 */
function paginateResults(data, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    page,
    limit,
    total: data.length,
    totalPages: Math.ceil(data.length / limit),
    results: paginatedData,
    hasMore: endIndex < data.length
  };
}
