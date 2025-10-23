import { useState } from 'react';
import { MagnifyingGlassIcon, PlayIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function YouTubeClipFinder({ contentTitle, onSelectClip }) {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchClips = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/youtube-clips/search?query=${encodeURIComponent(contentTitle + ' clip')}&maxResults=12`
      );
      const data = await response.json();
      setClips(data.items || []);
      setSearched(true);
    } catch (error) {
      console.error('Error searching clips:', error);
      alert('Failed to search YouTube clips');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <PlayIcon className="w-6 h-6 text-red-600 mr-2" />
            Find Existing YouTube Clips
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Search for "{contentTitle}" clips already on YouTube
          </p>
        </div>
        <button
          onClick={searchClips}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span>Search YouTube</span>
            </>
          )}
        </button>
      </div>

      {searched && clips.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No clips found. Try searching manually on YouTube.
        </div>
      )}

      {clips.length > 0 && (
        <div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Quick Workflow:</strong> Find a clip below → Open it on YouTube → 
              Use a browser extension or screen recorder to save it → Upload here for processing!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {clips.map((clip) => (
              <div
                key={clip.videoId}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative group cursor-pointer">
                  <img
                    src={clip.thumbnail}
                    alt={clip.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <PlayIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                <div className="p-3">
                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2">
                    {clip.title}
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">{clip.channelTitle}</p>
                  
                  <div className="flex gap-2">
                    <a
                      href={clip.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded flex items-center justify-center space-x-1"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      <span>Open on YouTube</span>
                    </a>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                    💡 Use a screen recorder or browser extension to save this video, then upload it here
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
