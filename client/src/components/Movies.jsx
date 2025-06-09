// Movies.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = '3c5f8694';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortOption, setSortOption] = useState('newest');

  const fetchMovies = async (query = '', year = '') => {
    setLoading(true);
    setError('');
    try {
      const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&y=${year}`;
      const res = await axios.get(url);
      if (res.data.Response === 'True') {
        const detailedMovies = await Promise.all(
          res.data.Search.slice(0, 10).map(async (movie) => {
            const detailsRes = await axios.get(
              `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
            );
            return detailsRes.data.Response === 'True' ? detailsRes.data : movie;
          })
        );

        setMovies(detailedMovies);

        const allGenres = new Set();
        detailedMovies.forEach((m) => {
          if (m.Genre) {
            m.Genre.split(',').forEach((g) => allGenres.add(g.trim()));
          }
        });
        setGenres(['All', ...Array.from(allGenres)]);
      } else {
        setMovies([]);
        setError(res.data.Error || 'No movies found.');
      }
    } catch (err) {
      console.error('Error fetching movies:', err.message);
      setError('Failed to fetch movies.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies('new', '2025');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      fetchMovies(searchTerm.trim());
      setSelectedGenre('All');
    }
  };

 const addToWatchlist = async (movie) => {
  const token = localStorage.getItem('token');
  if (!token) return alert('Please login to add movies to your watchlist.');

  try {
    await axios.post(
      'http://localhost:5000/api/watchlist',
      movie,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔄 Notify UserDashboard to re-fetch watchlist
    window.dispatchEvent(new Event('watchlistUpdated'));

    alert(`"${movie.Title}" added to your watchlist!`);
  } catch (err) {
    if (err.response?.data?.message === 'Movie already in watchlist') {
      alert(`"${movie.Title}" is already in your watchlist.`);
    } else {
      alert('Failed to add movie to watchlist');
      console.error(err);
    }
  }
};


  const filteredMovies = movies.filter((movie) => {
    if (selectedGenre === 'All') return true;
    if (!movie.Genre) return false;
    return movie.Genre.split(',').map((g) => g.trim()).includes(selectedGenre);
  });

  const sortedMovies = filteredMovies.sort((a, b) => {
    if (sortOption === 'newest') {
      return (b.Year || '').localeCompare(a.Year || '');
    } else if (sortOption === 'az') {
      return a.Title.localeCompare(b.Title);
    }
    return 0;
  });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies..."
          className="w-full sm:w-96 p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="newest">Newest First</option>
          <option value="az">A – Z</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center">Loading movies...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sortedMovies.map((movie) => (
            <div key={movie.imdbID} className="bg-white shadow rounded overflow-hidden text-black flex flex-col">
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : '/no-image.jpg'}
                alt={movie.Title}
                className="w-full h-64 object-cover"
              />
              <div className="p-3 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold">{movie.Title}</h3>
                  <p className="text-sm text-gray-600">{movie.Year}</p>
                  <p className="text-xs text-gray-500 italic">{movie.Genre || 'Unknown Genre'}</p>
                </div>
                <button
                  onClick={() => addToWatchlist(movie)}
                  className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-black py-1 px-3 rounded"
                >
                  + Add to Watchlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
