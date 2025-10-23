const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

// Create axios instance with proper authentication
const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: TMDB_READ_ACCESS_TOKEN ? {
    'Authorization': `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  } : {}
});

/**
 * Search for content on TMDb
 */
exports.searchContent = async (query, type = 'multi', page = 1) => {
  try {
    const params = {
      query,
      page,
      include_adult: false
    };
    
    // Add API key only if not using Bearer token
    if (!TMDB_READ_ACCESS_TOKEN) {
      params.api_key = TMDB_API_KEY;
    }
    
    const response = await tmdbClient.get(`/search/${type}`, { params });

    return {
      results: response.data.results.map(item => ({
        id: item.id,
        title: item.title || item.name,
        type: item.media_type || type,
        releaseDate: item.release_date || item.first_air_date,
        overview: item.overview,
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        popularity: item.popularity,
        voteAverage: item.vote_average
      })),
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results
    };
  } catch (error) {
    console.error('TMDb search error:', error.message);
    throw new Error('Failed to search content');
  }
};

/**
 * Get detailed information about content
 */
exports.getContentDetails = async (id, type = 'tv') => {
  try {
    const params = {
      append_to_response: 'credits,videos,external_ids'
    };
    
    if (!TMDB_READ_ACCESS_TOKEN) {
      params.api_key = TMDB_API_KEY;
    }
    
    const response = await tmdbClient.get(`/${type}/${id}`, { params });

    const data = response.data;

    return {
      id: data.id,
      title: data.title || data.name,
      type,
      overview: data.overview,
      releaseDate: data.release_date || data.first_air_date,
      posterPath: data.poster_path,
      backdropPath: data.backdrop_path,
      genres: data.genres,
      runtime: data.runtime || data.episode_run_time?.[0],
      voteAverage: data.vote_average,
      tagline: data.tagline,
      status: data.status,
      
      // TV-specific
      numberOfSeasons: data.number_of_seasons,
      numberOfEpisodes: data.number_of_episodes,
      seasons: data.seasons,
      
      // Credits
      cast: data.credits?.cast?.slice(0, 10).map(person => ({
        id: person.id,
        name: person.name,
        character: person.character,
        profilePath: person.profile_path
      })),
      crew: data.credits?.crew?.filter(person => 
        ['Director', 'Producer', 'Writer'].includes(person.job)
      ).map(person => ({
        id: person.id,
        name: person.name,
        job: person.job,
        profilePath: person.profile_path
      })),
      
      // Videos (trailers, clips)
      videos: data.videos?.results?.map(video => ({
        id: video.id,
        key: video.key,
        name: video.name,
        site: video.site,
        type: video.type
      })),
      
      // External IDs
      imdbId: data.external_ids?.imdb_id
    };
  } catch (error) {
    console.error('TMDb details error:', error.message);
    throw new Error('Failed to fetch content details');
  }
};

/**
 * Get episodes for a specific season
 */
exports.getSeasonEpisodes = async (tvId, seasonNumber) => {
  try {
    const params = {};
    
    if (!TMDB_READ_ACCESS_TOKEN) {
      params.api_key = TMDB_API_KEY;
    }
    
    const response = await tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}`, { params });

    const data = response.data;

    return {
      seasonNumber: data.season_number,
      name: data.name,
      overview: data.overview,
      airDate: data.air_date,
      episodes: data.episodes.map(ep => ({
        id: ep.id,
        episodeNumber: ep.episode_number,
        name: ep.name,
        overview: ep.overview,
        airDate: ep.air_date,
        runtime: ep.runtime,
        stillPath: ep.still_path,
        voteAverage: ep.vote_average
      }))
    };
  } catch (error) {
    console.error('TMDb season episodes error:', error.message);
    throw new Error('Failed to fetch season episodes');
  }
};

/**
 * Discover popular TV shows
 */
exports.discoverTVShows = async (options = {}) => {
  try {
    const params = {
      page: options.page || 1,
      sort_by: options.sortBy || 'popularity.desc',
      include_adult: false,
      'vote_count.gte': 100
    };
    
    // Add API key only if not using Bearer token
    if (!TMDB_READ_ACCESS_TOKEN) {
      params.api_key = TMDB_API_KEY;
    }
    
    const response = await tmdbClient.get('/discover/tv', { params });
    return {
      results: response.data.results,
      page: response.data.page,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error('TMDb discover TV shows error:', error.message);
    throw new Error('Failed to discover TV shows');
  }
};

/**
 * Discover popular movies
 */
exports.discoverMovies = async (options = {}) => {
  try {
    const params = {
      page: options.page || 1,
      sort_by: options.sortBy || 'popularity.desc',
      include_adult: false,
      'vote_count.gte': 100
    };
    
    // Add API key only if not using Bearer token
    if (!TMDB_READ_ACCESS_TOKEN) {
      params.api_key = TMDB_API_KEY;
    }
    
    const response = await tmdbClient.get('/discover/movie', { params });
    return {
      results: response.data.results,
      page: response.data.page,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error('TMDb discover movies error:', error.message);
    throw new Error('Failed to discover movies');
  }
};

/**
 * Get image URL
 */
exports.getImageUrl = (path, size = 'original') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
