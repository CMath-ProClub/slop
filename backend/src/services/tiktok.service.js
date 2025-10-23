const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2';

/**
 * Get TikTok OAuth authorization URL
 */
exports.getAuthUrl = () => {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = encodeURIComponent(
    `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/upload/tiktok/callback`
  );
  
  const scope = 'video.upload,video.publish';
  
  return `https://www.tiktok.com/v2/auth/authorize?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}`;
};

/**
 * Get access token from authorization code
 */
exports.getTokensFromCode = async (code) => {
  try {
    const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/upload/tiktok/callback`
    });

    return response.data;
  } catch (error) {
    console.error('TikTok token error:', error.message);
    throw new Error('Failed to get TikTok tokens');
  }
};

/**
 * Upload video to TikTok
 */
exports.uploadVideo = async ({ videoPath, caption, hashtags, accessToken }) => {
  try {
    // Step 1: Initialize upload
    const initResponse = await axios.post(
      `${TIKTOK_API_BASE}/post/publish/video/init/`,
      {
        post_info: {
          title: caption,
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_comment: false,
          disable_duet: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: fs.statSync(videoPath).size,
          chunk_size: 5242880, // 5MB chunks
          total_chunk_count: Math.ceil(fs.statSync(videoPath).size / 5242880)
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { publish_id, upload_url } = initResponse.data.data;

    // Step 2: Upload video file
    const formData = new FormData();
    formData.append('video', fs.createReadStream(videoPath));

    await axios.put(upload_url, formData, {
      headers: {
        ...formData.getHeaders(),
        'Content-Type': 'video/mp4'
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    // Step 3: Confirm upload
    const confirmResponse = await axios.post(
      `${TIKTOK_API_BASE}/post/publish/status/fetch/`,
      {
        publish_id
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      videoId: publish_id,
      shareUrl: confirmResponse.data.data?.share_url || ''
    };

  } catch (error) {
    console.error('TikTok upload error:', error.message);
    throw new Error('Failed to upload to TikTok');
  }
};

/**
 * Refresh access token
 */
exports.refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });

    return response.data;
  } catch (error) {
    console.error('TikTok token refresh error:', error.message);
    throw new Error('Failed to refresh TikTok token');
  }
};
