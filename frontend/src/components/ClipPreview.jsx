import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const ClipPreview = ({ clipId, onUpload }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadTarget, setUploadTarget] = useState(null);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [clipId]);

  const checkStatus = async () => {
    try {
      const data = await api.getClipStatus(clipId);
      setStatus(data);
      
      if (data.status === 'completed' || data.status === 'failed') {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  };

  const handleDownload = () => {
    window.open(`/api/clips/${clipId}/download`, '_blank');
  };

  const handleUpload = (platform) => {
    setUploadTarget(platform);
    onUpload(platform, clipId);
  };

  if (loading || !status) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Processing Your Clip
        </h3>
        <p className="text-gray-600">
          {status?.progress || 0}% complete
        </p>
        <p className="text-sm text-gray-500 mt-2">
          This may take a few minutes...
        </p>
      </div>
    );
  }

  if (status.status === 'failed') {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Processing Failed
          </h3>
          <p className="text-gray-600">
            {status.error || 'An error occurred while processing your clip.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Your Clip is Ready! 🎉
      </h2>

      <div className="vertical-video-container mb-6">
        <ReactPlayer
          url={status.videoUrl}
          controls
          width="100%"
          height="100%"
          playing
        />
      </div>

      <div className="space-y-4">
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Download Clip
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleUpload('youtube')}
            className="flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <ShareIcon className="h-5 w-5 mr-2" />
            Upload to YouTube
          </button>

          <button
            onClick={() => handleUpload('tiktok')}
            className="flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ShareIcon className="h-5 w-5 mr-2" />
            Upload to TikTok
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Clip Details</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>Format: MP4 (1080x1920)</li>
          <li>Aspect Ratio: 9:16 (Vertical)</li>
          <li>With Captions and Credits</li>
          <li>Optimized for TikTok & YouTube Shorts</li>
        </ul>
      </div>
    </div>
  );
};

export default ClipPreview;
