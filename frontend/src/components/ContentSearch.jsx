import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const ContentSearch = ({ onSelectContent }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await api.searchContent(query);
      setResults(data.results);
    } catch (err) {
      setError('Failed to search content. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300x450?text=No+Image';
    return `https://image.tmdb.org/t/p/w300${path}`;
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for TV shows, movies, or streamers..."
            className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 px-4 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectContent(item)}
              className="cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-shadow">
                <img
                  src={getImageUrl(item.posterPath)}
                  alt={item.title}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-sm line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-xs mt-1">
                      {item.releaseDate?.split('-')[0]} • {item.type}
                    </p>
                  </div>
                </div>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500">
                {item.releaseDate?.split('-')[0]}
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="text-center py-12 text-gray-500">
          No results found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default ContentSearch;
