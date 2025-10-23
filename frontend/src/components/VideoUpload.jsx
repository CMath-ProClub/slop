import { useState } from 'react';
import { CloudArrowUpIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

export default function VideoUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [config, setConfig] = useState({
    length: 60,
    addCaptions: true
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const clipId = `clip_${Date.now()}`;
      
      // Upload and process video
      const result = await api.uploadVideo(file, {
        clipId,
        length: config.length,
        addCaptions: config.addCaptions
      });

      setProgress(100);
      
      // Wait a bit to show completion
      setTimeout(() => {
        onUploadComplete(result);
      }, 500);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-dashed border-indigo-300">
      <div className="text-center mb-6">
        <VideoCameraIcon className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Your Own Video
        </h3>
        <p className="text-gray-600">
          Upload a video file and we'll process it for you: crop to vertical (9:16), add captions, and optimize for social media
        </p>
      </div>

      {!file ? (
        <div className="space-y-4">
          <label className="block">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              id="video-upload"
            />
            <div className="cursor-pointer bg-white hover:bg-gray-50 rounded-lg p-8 border-2 border-gray-300 hover:border-indigo-500 transition-all text-center">
              <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-lg font-semibold text-gray-700">Click to select video</p>
              <p className="text-sm text-gray-500 mt-1">MP4, MOV, AVI, or any video format</p>
            </div>
          </label>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Since streaming services don't allow automatic video downloads, 
              please upload your own video files. The system will automatically:
            </p>
            <ul className="text-sm text-yellow-700 mt-2 ml-4 list-disc space-y-1">
              <li>Convert to vertical format (9:16 for TikTok/Shorts)</li>
              <li>Add auto-generated captions using OpenAI Whisper</li>
              <li>Trim to your desired length (15-180 seconds)</li>
              <li>Optimize quality for social media uploads</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Info */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Clip Length: {config.length} seconds
              </label>
              <input
                type="range"
                min="15"
                max="180"
                step="5"
                value={config.length}
                onChange={(e) => setConfig({ ...config, length: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15s</span>
                <span>180s (3 min)</span>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="add-captions"
                checked={config.addCaptions}
                onChange={(e) => setConfig({ ...config, addCaptions: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="add-captions" className="ml-2 text-sm text-gray-700">
                Auto-generate captions (using OpenAI Whisper)
              </label>
            </div>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Processing Video... {progress}%</span>
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="w-5 h-5" />
                <span>Upload & Process Video</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
