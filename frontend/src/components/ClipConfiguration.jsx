import React, { useState, useEffect } from 'react';
import api from '../services/api';
import YouTubeClipFinder from './YouTubeClipFinder';

const ClipConfiguration = ({ content, onCreateClip }) => {
  const [config, setConfig] = useState({
    length: 60,
    clipType: 'highlight',
    season: 1,
    episode: 1,
    hashtags: '',
    customCaption: ''
  });
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (content.type === 'tv') {
      loadContentDetails();
    }
  }, [content]);

  useEffect(() => {
    if (config.season && content.type === 'tv') {
      loadEpisodes();
    }
  }, [config.season]);

  const loadContentDetails = async () => {
    try {
      const details = await api.getContentDetails(content.id, 'tv');
      setSeasons(details.seasons || []);
    } catch (error) {
      console.error('Failed to load content details:', error);
    }
  };

  const loadEpisodes = async () => {
    try {
      const data = await api.getSeasonEpisodes(content.id, config.season);
      setEpisodes(data.episodes || []);
    } catch (error) {
      console.error('Failed to load episodes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const clipData = {
        contentId: content.id,
        contentType: content.type,
        length: config.length,
        clipType: config.clipType,
        hashtags: config.hashtags.split(',').map(h => h.trim()).filter(Boolean),
        customCaption: config.customCaption,
        ...(content.type === 'tv' && {
          season: parseInt(config.season),
          episode: parseInt(config.episode)
        })
      };

      const result = await api.createClip(clipData);
      onCreateClip(result);
    } catch (error) {
      console.error('Failed to create clip:', error);
      alert('Failed to create clip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* YouTube Clip Finder */}
      <YouTubeClipFinder contentTitle={content.title} />

      {/* Configuration Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Configure Your Clip
        </h2>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900">{content.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{content.overview}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Clip Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clip Length: {config.length} seconds
          </label>
          <input
            type="range"
            min="15"
            max="180"
            step="5"
            value={config.length}
            onChange={(e) => setConfig({ ...config, length: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>15s</span>
            <span>180s (3 min)</span>
          </div>
        </div>

        {/* Clip Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clip Type
          </label>
          <select
            value={config.clipType}
            onChange={(e) => setConfig({ ...config, clipType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="highlight">Highlight Moments</option>
            <option value="funny">Funny Moments</option>
            <option value="action">Action Scenes</option>
            <option value="dramatic">Dramatic Scenes</option>
            <option value="quotes">Memorable Quotes</option>
            <option value="random">Random Clip</option>
          </select>
        </div>

        {/* Season and Episode (TV Shows only) */}
        {content.type === 'tv' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Season
              </label>
              <select
                value={config.season}
                onChange={(e) => setConfig({ ...config, season: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {seasons.map((season) => (
                  <option key={season.seasonNumber} value={season.seasonNumber}>
                    Season {season.seasonNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Episode
              </label>
              <select
                value={config.episode}
                onChange={(e) => setConfig({ ...config, episode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {episodes.map((episode) => (
                  <option key={episode.episodeNumber} value={episode.episodeNumber}>
                    Episode {episode.episodeNumber}: {episode.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Hashtags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hashtags (comma separated)
          </label>
          <input
            type="text"
            value={config.hashtags}
            onChange={(e) => setConfig({ ...config, hashtags: e.target.value })}
            placeholder="funny, viral, trending"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Custom Caption */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Caption (optional)
          </label>
          <textarea
            value={config.customCaption}
            onChange={(e) => setConfig({ ...config, customCaption: e.target.value })}
            placeholder="Add a custom caption for your clip..."
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Creating Clip...' : 'Create Clip'}
        </button>
      </form>
      </div>
    </div>
  );
};

export default ClipConfiguration;
