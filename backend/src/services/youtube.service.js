const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/upload/youtube/callback`
);

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client
});

/**
 * Get YouTube OAuth authorization URL
 */
exports.getAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
};

/**
 * Get tokens from authorization code
 */
exports.getTokensFromCode = async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  } catch (error) {
    console.error('YouTube token error:', error.message);
    throw new Error('Failed to get YouTube tokens');
  }
};

/**
 * Upload video to YouTube Shorts
 */
exports.uploadVideo = async ({ videoPath, title, description, tags, accessToken }) => {
  try {
    // Set credentials
    oauth2Client.setCredentials({
      access_token: accessToken
    });

    const fileSize = fs.statSync(videoPath).size;

    // Upload video
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: title.substring(0, 100), // YouTube title limit
          description: description + '\n\n#Shorts',
          tags: tags,
          categoryId: '24' // Entertainment category
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false
        }
      },
      media: {
        body: fs.createReadStream(videoPath)
      }
    });

    return {
      videoId: response.data.id,
      url: `https://youtube.com/shorts/${response.data.id}`
    };
  } catch (error) {
    console.error('YouTube upload error:', error.message);
    throw new Error('Failed to upload to YouTube');
  }
};

/**
 * Refresh access token
 */
exports.refreshAccessToken = async (refreshToken) => {
  try {
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    const { credentials } = await oauth2Client.refreshAccessToken();
    return credentials;
  } catch (error) {
    console.error('Token refresh error:', error.message);
    throw new Error('Failed to refresh YouTube token');
  }
};
