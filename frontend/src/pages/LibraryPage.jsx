import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('tv');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadContent();
  }, [activeTab, page]);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      switch (activeTab) {
        case 'tv':
          response = await api.get(`/library/tv-shows?page=${page}&limit=50`);
          break;
        case 'movies':
          response = await api.get(`/library/movies?page=${page}&limit=50`);
          break;
        case 'streamers':
          response = await api.get(`/library/streamers?page=${page}&limit=50`);
          break;
        default:
          return;
      }
      
      setContent(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to load content');
      console.error('Error loading library:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/200x300?text=No+Image';
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            📚 Content Library
          </h1>
          <p className="text-xl text-gray-300">
            Browse popular content to create clips from
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => { setActiveTab('tv'); setPage(1); }}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'tv'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            📺 Top 500 TV Shows
          </button>
          <button
            onClick={() => { setActiveTab('movies'); setPage(1); }}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'movies'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎬 Top 1000 Movies
          </button>
          <button
            onClick={() => { setActiveTab('streamers'); setPage(1); }}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'streamers'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎮 Top 100 Streamers
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
            <p className="text-white mt-4 text-lg">Loading content...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-8">
            <p className="font-semibold">Error: {error}</p>
          </div>
        )}

        {/* Content Grid */}
        {!loading && !error && (
          <>
            {activeTab === 'streamers' ? (
              // Streamers List
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.map((streamer) => (
                  <div
                    key={streamer.id}
                    className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all hover:scale-105 cursor-pointer shadow-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                        {streamer.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{streamer.name}</h3>
                        <p className="text-gray-400">{streamer.platform}</p>
                        <p className="text-sm text-purple-400">{streamer.category}</p>
                        <p className="text-sm text-gray-500">{streamer.subscribers || streamer.followers}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        to={`/create?streamer=${encodeURIComponent(streamer.name)}`}
                        className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-colors"
                      >
                        Create Clip
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Movies/TV Shows Grid
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {content.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-all cursor-pointer shadow-lg"
                  >
                    <img
                      src={getImageUrl(item.poster_path)}
                      alt={item.title || item.name}
                      className="w-full h-72 object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                        {item.title || item.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span>⭐ {item.vote_average?.toFixed(1) || 'N/A'}</span>
                        <span>{item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'N/A'}</span>
                      </div>
                      <Link
                        to={`/create?contentId=${item.id}&type=${activeTab === 'tv' ? 'tv' : 'movie'}`}
                        className="block text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Create Clip
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-4 mt-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                ← Previous
              </button>
              <span className="text-white font-semibold">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
