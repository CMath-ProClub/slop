const { v4: uuidv4 } = require('uuid');
const videoProcessorService = require('../services/video-processor.service');
const clipStorageService = require('../services/clip-storage.service');

// In-memory clip status storage (use database in production)
const clipStatuses = new Map();

/**
 * Create a clip from existing content
 */
exports.createClip = async (req, res, next) => {
  try {
    const {
      contentId,
      contentType,
      season,
      episode,
      length,
      clipType,
      hashtags,
      startTime,
      customCaption
    } = req.body;

    // Validate input
    if (!contentId || !length) {
      return res.status(400).json({ error: 'Content ID and length are required' });
    }

    if (length > parseInt(process.env.MAX_CLIP_LENGTH || '180')) {
      return res.status(400).json({ error: 'Clip length exceeds maximum allowed' });
    }

    // Generate unique clip ID
    const clipId = uuidv4();

    // Initialize clip status
    clipStatuses.set(clipId, {
      clipId,
      status: 'processing',
      progress: 0,
      createdAt: new Date().toISOString()
    });

    // Send immediate response
    res.json({
      clipId,
      status: 'processing',
      message: 'Clip creation started'
    });

    // Process clip asynchronously
    videoProcessorService.createClip({
      clipId,
      contentId,
      contentType,
      season,
      episode,
      length,
      clipType,
      hashtags,
      startTime,
      customCaption
    }).then(result => {
      clipStatuses.set(clipId, {
        clipId,
        status: 'completed',
        progress: 100,
        videoUrl: result.videoUrl,
        completedAt: new Date().toISOString()
      });
    }).catch(error => {
      console.error('Clip processing error:', error);
      clipStatuses.set(clipId, {
        clipId,
        status: 'failed',
        error: error.message,
        failedAt: new Date().toISOString()
      });
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Upload and process user's own video
 */
exports.uploadAndProcess = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const {
      length,
      addCaptions,
      hashtags,
      customText
    } = req.body;

    const clipId = uuidv4();

    clipStatuses.set(clipId, {
      clipId,
      status: 'processing',
      progress: 0,
      createdAt: new Date().toISOString()
    });

    res.json({
      clipId,
      status: 'processing',
      message: 'Video upload successful, processing started'
    });

    // Process uploaded video asynchronously
    videoProcessorService.processUploadedVideo({
      clipId,
      videoPath: req.file.path,
      length: parseInt(length),
      addCaptions: addCaptions === 'true',
      hashtags: hashtags ? JSON.parse(hashtags) : [],
      customText
    }).then(result => {
      clipStatuses.set(clipId, {
        clipId,
        status: 'completed',
        progress: 100,
        videoUrl: result.videoUrl,
        completedAt: new Date().toISOString()
      });
    }).catch(error => {
      console.error('Video processing error:', error);
      clipStatuses.set(clipId, {
        clipId,
        status: 'failed',
        error: error.message,
        failedAt: new Date().toISOString()
      });
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get clip processing status
 */
exports.getClipStatus = async (req, res, next) => {
  try {
    const { clipId } = req.params;

    const status = clipStatuses.get(clipId);

    if (!status) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    res.json(status);
  } catch (error) {
    next(error);
  }
};

/**
 * Download processed clip
 */
exports.downloadClip = async (req, res, next) => {
  try {
    const { clipId } = req.params;

    const clipData = await clipStorageService.getClip(clipId);

    if (!clipData) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    res.download(clipData.filePath, `clip-${clipId}.mp4`);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all clips for a user
 */
exports.getUserClips = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // This would typically query a database
    // For now, return empty array
    res.json([]);
  } catch (error) {
    next(error);
  }
};
