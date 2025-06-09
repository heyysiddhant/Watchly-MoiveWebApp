import { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [watchlist, setWatchlist] = useState([]);

  const fetchWatchlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('/api/watchlist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(res.data);
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
    }
  };

  const handleDelete = async (imdbID) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`/api/watchlist/${imdbID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(prev => prev.filter(movie => movie.imdbID !== imdbID));
    } catch (err) {
      console.error('Failed to delete movie:', err);
    }
  };

  useEffect(() => {
    fetchWatchlist();

    // Listen for custom "watchlistUpdated" event
    const handleUpdate = () => {
      fetchWatchlist();
    };

    window.addEventListener('watchlistUpdated', handleUpdate);

    return () => {
      window.removeEventListener('watchlistUpdated', handleUpdate);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-red-700">👤 Your Dashboard</h1>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">🎬 Your Watchlist</h2>
        {watchlist.length === 0 ? (
          <p className="text-gray-300">No movies in your watchlist yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {watchlist.map((movie) => (
              <div key={movie.imdbID} className="bg-white text-black rounded shadow overflow-hidden">
                <img
                  src={movie.Poster !== 'N/A' ? movie.Poster : '/no-image.jpg'}
                  alt={movie.Title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-3 flex flex-col gap-2">
                  <h3 className="font-bold">{movie.Title}</h3>
                  <p className="text-sm text-gray-700">{movie.Year}</p>
                  <p className="text-xs text-gray-500">{movie.Genre || 'Unknown Genre'}</p>
                  <button
                    onClick={() => handleDelete(movie.imdbID)}
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
