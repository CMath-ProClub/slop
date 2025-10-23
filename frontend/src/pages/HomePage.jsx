import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  VideoCameraIcon, 
  SparklesIcon, 
  CloudArrowUpIcon,
  DevicePhoneMobileIcon 
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: VideoCameraIcon,
      title: 'AI-Powered Clip Selection',
      description: 'Automatically extract the most engaging moments from your favorite shows and movies.'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Vertical Format',
      description: 'Perfect 9:16 aspect ratio optimized for TikTok and YouTube Shorts.'
    },
    {
      icon: SparklesIcon,
      title: 'Auto Captions & Credits',
      description: 'Professional captions and metadata overlays added automatically.'
    },
    {
      icon: CloudArrowUpIcon,
      title: 'Direct Upload',
      description: 'Upload directly to YouTube Shorts and TikTok with one click.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Create Viral Short Videos
          <br />
          <span className="text-primary-600">In Minutes</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform TV shows, movies, and streamer content into engaging vertical clips 
          perfect for TikTok and YouTube Shorts.
        </p>
        <button
          onClick={() => navigate('/create')}
          className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <VideoCameraIcon className="h-6 w-6 mr-2" />
          Start Creating
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <feature.icon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 text-primary-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Search Content
            </h3>
            <p className="text-gray-600">
              Find your favorite TV show, movie, or streamer content using our search.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 text-primary-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Configure Clip
            </h3>
            <p className="text-gray-600">
              Choose clip length, type, and customize captions and hashtags.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 text-primary-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Download or Upload
            </h3>
            <p className="text-gray-600">
              Download your clip or upload directly to TikTok and YouTube Shorts.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Create Viral Content?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of creators making engaging short-form videos
        </p>
        <button
          onClick={() => navigate('/create')}
          className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition-colors shadow-lg"
        >
          Get Started Free
        </button>
      </div>
    </div>
  );
};

export default HomePage;
