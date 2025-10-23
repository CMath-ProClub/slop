import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Content Search
export const searchContent = async (query, type = 'multi', page = 1) => {
  const response = await apiClient.get('/content/search', {
    params: { query, type, page }
  });
  return response.data;
};

export const getAutocomplete = async (query) => {
  const response = await apiClient.get('/content/autocomplete', {
    params: { query }
  });
  return response.data;
};

export const getContentDetails = async (id, type = 'tv') => {
  const response = await apiClient.get(`/content/${id}`, {
    params: { type }
  });
  return response.data;
};

export const getSeasonEpisodes = async (id, seasonNumber) => {
  const response = await apiClient.get(`/content/${id}/season/${seasonNumber}`);
  return response.data;
};

// Clip Creation
export const createClip = async (clipData) => {
  const response = await apiClient.post('/clips/create', clipData);
  return response.data;
};

export const uploadVideo = async (file, metadata) => {
  const formData = new FormData();
  formData.append('video', file);
  Object.keys(metadata).forEach(key => {
    formData.append(key, metadata[key]);
  });

  const response = await apiClient.post('/clips/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getClipStatus = async (clipId) => {
  const response = await apiClient.get(`/clips/${clipId}/status`);
  return response.data;
};

// Social Media Upload
export const getYouTubeAuthUrl = async () => {
  const response = await apiClient.get('/upload/youtube/auth-url');
  return response.data.authUrl;
};

export const uploadToYouTube = async (clipId, title, description, tags, accessToken) => {
  const response = await apiClient.post('/upload/youtube', {
    clipId,
    title,
    description,
    tags,
    accessToken
  });
  return response.data;
};

export const getTikTokAuthUrl = async () => {
  const response = await apiClient.get('/upload/tiktok/auth-url');
  return response.data.authUrl;
};

export const uploadToTikTok = async (clipId, caption, hashtags, accessToken) => {
  const response = await apiClient.post('/upload/tiktok', {
    clipId,
    caption,
    hashtags,
    accessToken
  });
  return response.data;
};

// Library endpoints
export const getLibraryTVShows = async (page = 1, limit = 50) => {
  const response = await apiClient.get('/library/tv-shows', {
    params: { page, limit }
  });
  return response.data;
};

export const getLibraryMovies = async (page = 1, limit = 50) => {
  const response = await apiClient.get('/library/movies', {
    params: { page, limit }
  });
  return response.data;
};

export const getLibraryStreamers = async (page = 1, limit = 50) => {
  const response = await apiClient.get('/library/streamers', {
    params: { page, limit }
  });
  return response.data;
};

export default {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  searchContent,
  getAutocomplete,
  getContentDetails,
  getSeasonEpisodes,
  createClip,
  uploadVideo,
  getClipStatus,
  getYouTubeAuthUrl,
  uploadToYouTube,
  getTikTokAuthUrl,
  uploadToTikTok,
  getLibraryTVShows,
  getLibraryMovies,
  getLibraryStreamers
};
