const path = require('path');
const fs = require('fs').promises;
const AWS = require('aws-sdk');

const USE_S3 = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_S3_BUCKET;
const LOCAL_STORAGE_PATH = process.env.VIDEO_OUTPUT_DIR || './processed';

// Configure AWS S3 if credentials are provided
let s3;
if (USE_S3) {
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
  });
}

/**
 * Store clip metadata and file location
 */
exports.storeClip = async (clipId, metadata) => {
  // In production, this would store in a database
  // For now, we'll use filesystem
  const metadataPath = path.join(LOCAL_STORAGE_PATH, `${clipId}.json`);
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  
  return metadata;
};

/**
 * Get clip metadata and file location
 */
exports.getClip = async (clipId) => {
  try {
    const metadataPath = path.join(LOCAL_STORAGE_PATH, `${clipId}.json`);
    const metadataJson = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(metadataJson);
  } catch (error) {
    console.error('Clip retrieval error:', error.message);
    return null;
  }
};

/**
 * Upload clip to S3
 */
exports.uploadToS3 = async (clipId, filePath) => {
  if (!USE_S3) {
    throw new Error('S3 not configured');
  }

  try {
    const fileContent = await fs.readFile(filePath);
    const fileName = `clips/${clipId}.mp4`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: fileContent,
      ContentType: 'video/mp4',
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error.message);
    throw new Error('Failed to upload to S3');
  }
};

/**
 * Delete clip
 */
exports.deleteClip = async (clipId) => {
  try {
    // Delete local file
    const videoPath = path.join(LOCAL_STORAGE_PATH, `${clipId}.mp4`);
    const metadataPath = path.join(LOCAL_STORAGE_PATH, `${clipId}.json`);
    
    await fs.unlink(videoPath).catch(() => {});
    await fs.unlink(metadataPath).catch(() => {});

    // Delete from S3 if configured
    if (USE_S3) {
      await s3.deleteObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `clips/${clipId}.mp4`
      }).promise();
    }

    return true;
  } catch (error) {
    console.error('Clip deletion error:', error.message);
    return false;
  }
};

/**
 * Get clip URL (local or S3)
 */
exports.getClipUrl = (clipId) => {
  if (USE_S3) {
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/clips/${clipId}.mp4`;
  }
  return `${process.env.BACKEND_URL || 'http://localhost:5000'}/videos/${clipId}.mp4`;
};
