import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { FaTrash } from 'react-icons/fa';

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

    const handleUpdate = () => {
      fetchWatchlist();
    };

    window.addEventListener('watchlistUpdated', handleUpdate);
    return () => window.removeEventListener('watchlistUpdated', handleUpdate);
  }, []);

  return (
    <div className="bg-[#0f0f0f] text-white pt-24 px-4 pb-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">🎬 Your Watchlist</h1>

        {watchlist.length === 0 ? (
          <div className="text-gray-400 text-lg">You haven't added any movies yet.</div>
        ) : (
          // ✅ WRAP the scrollable row in a block container so height is respected
          <div className="w-full">
            <div className="overflow-x-auto">
              <div className="flex space-x-4 sm:space-x-6 overflow-x-scroll pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
                {watchlist.map((movie) => (
                  <div
                    key={movie.imdbID}
                    className="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] bg-[#1f1f1f] border border-gray-700 rounded-xl shadow-md snap-start hover:scale-105 transition-transform duration-300"
                  >
                    <img
                      src={movie.Poster !== 'N/A' ? movie.Poster : '/no-image.jpg'}
                      alt={movie.Title}
                      className="w-full h-52 object-cover rounded-t-xl"
                    />
                    <div className="p-3">
                      <h3 className="text-base font-semibold text-white truncate">{movie.Title}</h3>
                      <p className="text-xs text-gray-400">{movie.Year}</p>
                      <p className="text-xs text-gray-500 truncate">{movie.Genre || 'Unknown Genre'}</p>
                      <button
                        onClick={() => handleDelete(movie.imdbID)}
                        className="mt-2 bg-red-600 hover:bg-red-700 transition text-white py-1 px-3 rounded text-xs flex items-center gap-2"
                      >
                        <FaTrash className="text-xs" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
