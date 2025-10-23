const youtubeService = require('../services/youtube.service');
const tiktokService = require('../services/tiktok.service');
const clipStorageService = require('../services/clip-storage.service');

/**
 * Upload clip to YouTube Shorts
 */
exports.uploadToYouTube = async (req, res, next) => {
  try {
    const {
      clipId,
      title,
      description,
      tags,
      accessToken
    } = req.body;

    if (!clipId || !title || !accessToken) {
      return res.status(400).json({ 
        error: 'Clip ID, title, and access token are required' 
      });
    }

    const clipData = await clipStorageService.getClip(clipId);

    if (!clipData) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    const result = await youtubeService.uploadVideo({
      videoPath: clipData.filePath,
      title,
      description,
      tags: tags || [],
      accessToken
    });

    res.json({
      success: true,
      videoId: result.videoId,
      url: `https://youtube.com/shorts/${result.videoId}`
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get YouTube OAuth authorization URL
 */
exports.getYouTubeAuthUrl = async (req, res, next) => {
  try {
    const authUrl = youtubeService.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle YouTube OAuth callback
 */
exports.youtubeCallback = async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const tokens = await youtubeService.getTokensFromCode(code);

    // In production, store tokens securely for the user
    res.json({
      success: true,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Upload clip to TikTok
 */
exports.uploadToTikTok = async (req, res, next) => {
  try {
    const {
      clipId,
      caption,
      hashtags,
      accessToken
    } = req.body;

    if (!clipId || !accessToken) {
      return res.status(400).json({ 
        error: 'Clip ID and access token are required' 
      });
    }

    const clipData = await clipStorageService.getClip(clipId);

    if (!clipData) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    const result = await tiktokService.uploadVideo({
      videoPath: clipData.filePath,
      caption,
      hashtags: hashtags || [],
      accessToken
    });

    res.json({
      success: true,
      videoId: result.videoId,
      shareUrl: result.shareUrl
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get TikTok OAuth authorization URL
 */
exports.getTikTokAuthUrl = async (req, res, next) => {
  try {
    const authUrl = tiktokService.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    next(error);
  }
};
