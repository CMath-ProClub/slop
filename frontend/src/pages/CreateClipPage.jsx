import React, { useState } from 'react';
import ContentSearch from '../components/ContentSearch';
import ClipConfiguration from '../components/ClipConfiguration';
import ClipPreview from '../components/ClipPreview';
import api from '../services/api';

const CreateClipPage = () => {
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

  const handleReset = () => {
    setStep(1);
    setSelectedContent(null);
    setClipId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
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
