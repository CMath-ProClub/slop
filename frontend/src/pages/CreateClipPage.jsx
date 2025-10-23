import React, { useState } from 'react';
import ContentSearch from '../components/ContentSearch';
import ClipConfiguration from '../components/ClipConfiguration';
import ClipPreview from '../components/ClipPreview';
import VideoUpload from '../components/VideoUpload';
import api from '../services/api';

const CreateClipPage = () => {
  const [mode, setMode] = useState(null); // 'search' or 'upload'
  const [step, setStep] = useState(1);
  const [selectedContent, setSelectedContent] = useState(null);
  const [clipId, setClipId] = useState(null);

  const handleSelectContent = (content) => {
    setSelectedContent(content);
    setStep(2);
  };

  const handleCreateClip = (result) => {
    setClipId(result.clipId);
    setStep(3);
  };

  const handleUpload = async (platform, clipId) => {
    try {
      if (platform === 'youtube') {
        const authUrl = await api.getYouTubeAuthUrl();
        window.open(authUrl, '_blank');
      } else if (platform === 'tiktok') {
        const authUrl = await api.getTikTokAuthUrl();
        window.open(authUrl, '_blank');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to initiate upload. Please try again.');
    }
  };

  const handleUploadComplete = (result) => {
    setClipId(result.clipId);
    setMode('upload');
    setStep(3);
  };

  const handleReset = () => {
    setMode(null);
    setStep(1);
    setSelectedContent(null);
    setClipId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mode Selection or Progress Steps */}
      {!mode && (
        <div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create a Vertical Clip
            </h1>
            <p className="text-lg text-gray-600">
              Choose how you want to create your clip
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Upload Option */}
            <div 
              onClick={() => setMode('upload')}
              className="cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white hover:scale-105 transition-all shadow-xl"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3">Upload Video</h2>
                <p className="text-indigo-100 mb-4">
                  Upload your own video file and we'll process it for you
                </p>
                <div className="bg-white/10 rounded-lg p-4 text-sm">
                  <p className="font-semibold mb-2">✨ We will:</p>
                  <ul className="text-left space-y-1 text-indigo-100">
                    <li>• Convert to vertical (9:16)</li>
                    <li>• Add auto-captions</li>
                    <li>• Optimize for TikTok/Shorts</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Search Option */}
            <div 
              onClick={() => { setMode('search'); setStep(1); }}
              className="cursor-pointer bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-8 text-white hover:scale-105 transition-all shadow-xl"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3">Browse Library</h2>
                <p className="text-blue-100 mb-4">
                  Search our library of TV shows, movies, and streamers
                </p>
                <div className="bg-white/10 rounded-lg p-4 text-sm">
                  <p className="font-semibold mb-2">📚 Browse:</p>
                  <ul className="text-left space-y-1 text-blue-100">
                    <li>• 500 Top TV Shows</li>
                    <li>• 1,000 Top Movies</li>
                    <li>• 100 Top Streamers</li>
                  </ul>
                </div>
                <div className="mt-4 bg-yellow-400/20 border border-yellow-400/30 rounded-lg p-3 text-xs text-yellow-100">
                  <strong>Note:</strong> You'll need to provide the video file
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'upload' && (
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleReset}
            className="mb-6 text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Options
          </button>
          {step !== 3 ? (
            <VideoUpload onUploadComplete={handleUploadComplete} />
          ) : (
            <div>
              <ClipPreview 
                clipId={clipId} 
                onUpload={handleUpload}
              />
              <button
                onClick={handleReset}
                className="mt-6 w-full px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Create Another Clip
              </button>
            </div>
          )}
        </div>
      )}

      {mode === 'search' && (
        <div>
          {/* Progress Steps */}
          <div className="mb-8">
            <button
              onClick={handleReset}
              className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Options
            </button>
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  1
                </div>
                <div className={`w-24 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  2
                </div>
                <div className={`w-24 h-1 mx-2 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  3
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-2 text-sm text-gray-600">
              <span className="mx-8">Search</span>
              <span className="mx-8">Configure</span>
              <span className="mx-8">Preview</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="max-w-4xl mx-auto">
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Search for Content
                </h2>
                <ContentSearch onSelectContent={handleSelectContent} />
              </div>
            )}

        {step === 2 && selectedContent && (
          <div>
            <button
              onClick={() => setStep(1)}
              className="mb-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Search
            </button>
            <ClipConfiguration 
              content={selectedContent} 
              onCreateClip={handleCreateClip}
            />
          </div>
        )}

        {step === 3 && clipId && (
          <div>
            <ClipPreview 
              clipId={clipId} 
              onUpload={handleUpload}
            />
            <button
              onClick={handleReset}
              className="mt-6 w-full px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Create Another Clip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateClipPage;
