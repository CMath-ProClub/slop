const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const VIDEO_PROCESSOR_URL = process.env.VIDEO_PROCESSOR_URL || 'http://localhost:8000';

/**
 * Create a clip from content
 */
exports.createClip = async (options) => {
  try {
    const response = await axios.post(`${VIDEO_PROCESSOR_URL}/process/create-clip`, {
      clipId: options.clipId,
      contentId: options.contentId,
      contentType: options.contentType,
      season: options.season,
      episode: options.episode,
      length: options.length,
      clipType: options.clipType,
      hashtags: options.hashtags,
      startTime: options.startTime,
      customCaption: options.customCaption
    }, {
      timeout: 600000 // 10 minutes timeout
    });

    return response.data;
  } catch (error) {
    console.error('Video processor error:', error.message);
    throw new Error('Failed to create clip');
  }
};

/**
 * Process uploaded video
 */
exports.processUploadedVideo = async (options) => {
  try {
    const formData = new FormData();
    formData.append('video', fs.createReadStream(options.videoPath));
    formData.append('clipId', options.clipId);
    formData.append('length', options.length);
    formData.append('addCaptions', options.addCaptions);
    formData.append('hashtags', JSON.stringify(options.hashtags));
    formData.append('customText', options.customText || '');

    const response = await axios.post(
      `${VIDEO_PROCESSOR_URL}/process/uploaded-video`,
      formData,
      {
        headers: formData.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 600000 // 10 minutes
      }
    );

    return response.data;
  } catch (error) {
    console.error('Video processing error:', error.message);
    throw new Error('Failed to process uploaded video');
  }
};

/**
 * Check processing status
 */
exports.getProcessingStatus = async (clipId) => {
  try {
    const response = await axios.get(
      `${VIDEO_PROCESSOR_URL}/process/status/${clipId}`
    );
    return response.data;
  } catch (error) {
    console.error('Status check error:', error.message);
    throw new Error('Failed to check processing status');
  }
};
