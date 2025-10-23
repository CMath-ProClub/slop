const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY;

/**
 * Search for YouTube clips related to TV shows/movies
 * Returns information about clips, not the videos themselves
 */
exports.searchYouTubeClips = async (query, maxResults = 10) => {
  try {
    if (!YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured');
      return { items: [] };
    }

    // Search for short clips (under 4 minutes)
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: YOUTUBE_API_KEY,
        q: `${query} clip short`,
        part: 'snippet',
        type: 'video',
        maxResults: maxResults,
        videoDuration: 'short', // Under 4 minutes
        order: 'relevance',
        safeSearch: 'none'
      }
    });

    return {
      items: response.data.items.map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        // Provide embed URL and watch URL for reference
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
        watchUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }))
    };
  } catch (error) {
    console.error('YouTube search error:', error.message);
    throw new Error('Failed to search YouTube clips');
  }
};

/**
 * Get video details including duration
 */
exports.getVideoDetails = async (videoId) => {
  try {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        key: YOUTUBE_API_KEY,
        id: videoId,
        part: 'snippet,contentDetails,statistics'
      }
    });

    const video = response.data.items[0];
    if (!video) {
      throw new Error('Video not found');
    }

    return {
      videoId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      duration: video.contentDetails.duration,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      thumbnail: video.snippet.thumbnails.high.url,
      embedUrl: `https://www.youtube.com/embed/${video.id}`,
      watchUrl: `https://www.youtube.com/watch?v=${video.id}`
    };
  } catch (error) {
    console.error('YouTube video details error:', error.message);
    throw new Error('Failed to get video details');
  }
};

module.exports = {
  searchYouTubeClips,
  getVideoDetails
};
