import { useEffect, useState } from "react";
import axios from "../api/axios";

const API_KEY = "3c5f8694";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchMovies = async (query = "", year = "") => {
    setLoading(true);
    setError("");
    try {
      const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&y=${year}`;
      const res = await axios.get(url);
      if (res.data.Response === "True") {
        const detailedMovies = await Promise.all(
          res.data.Search.slice(0, 10).map(async (movie) => {
            const detailsRes = await axios.get(
              `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
            );
            return detailsRes.data.Response === "True"
              ? detailsRes.data
              : movie;
          })
        );

        setMovies(detailedMovies);

        const allGenres = new Set();
        detailedMovies.forEach((m) => {
          if (m.Genre) {
            m.Genre.split(",").forEach((g) => allGenres.add(g.trim()));
          }
        });
        setGenres(["All", ...Array.from(allGenres)]);
      } else {
        setMovies([]);
        setError(res.data.Error || "No movies found.");
      }
    } catch (err) {
      console.error("Error fetching movies:", err.message);
      setError("Failed to fetch movies.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies("new", "2025");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      fetchMovies(searchTerm.trim());
      setSelectedGenre("All");
    }
  };

  const addToWatchlist = async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to add movies to your watchlist.");

    try {
      await axios.post("/api/watchlist", movie, {
        headers: { Authorization: `Bearer ${token}` },
      });

      window.dispatchEvent(new Event("watchlistUpdated"));

      setSuccessMessage(`"${movie.Title}" added to your watchlist!`);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      if (err.response?.data?.message === "Movie already in watchlist") {
        setSuccessMessage(`"${movie.Title}" is already in your watchlist.`);
      } else {
        setSuccessMessage("Failed to add movie to watchlist");
        console.error(err);
      }
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  const filteredMovies = movies.filter((movie) => {
    if (selectedGenre === "All") return true;
    if (!movie.Genre) return false;
    return movie.Genre.split(",")
      .map((g) => g.trim())
      .includes(selectedGenre);
  });

  const sortedMovies = filteredMovies.sort((a, b) => {
    if (sortOption === "newest") {
      return (b.Year || "").localeCompare(a.Year || "");
    } else if (sortOption === "az") {
      return a.Title.localeCompare(b.Title);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white p-6 relative">
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-slide-down">
          {successMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <form
          onSubmit={handleSearch}
          className="mb-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for movies..."
            className="w-full sm:w-96 px-4 py-2 rounded-lg bg-[#0f1a2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg font-medium"
          >
            🔍 Search
          </button>
        </form>

        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#1a2238] text-white focus:outline-none"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre} className="text-black">
                {genre}
              </option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#1a2238] text-white focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="az">A – Z</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-lg">Loading movies...</p>
        ) : error ? (
          <p className="text-center text-red-400 text-lg">{error}</p>
        ) : (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {sortedMovies.map((movie) => (
              <div
                key={movie.imdbID}
                className="bg-[#1e2746] rounded-xl shadow-md overflow-hidden flex flex-col hover:scale-[1.03] transition-transform"
              >
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : "/no-image.jpg"}
                  alt={movie.Title}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                <div className="p-4 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-semibold text-lg truncate">
                      {movie.Title}
                    </h3>
                    <p className="text-sm text-gray-400">{movie.Year}</p>
                    <p className="text-xs text-gray-500 italic truncate">
                      {movie.Genre || "Unknown Genre"}
                    </p>
                    {movie.imdbRating && (
                      <p className="text-sm text-yellow-400 mt-1">
                        ⭐ {movie.imdbRating}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => addToWatchlist(movie)}
                    className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black py-1 px-3 rounded text-sm font-medium"
                  >
                    ➕ Add to Watchlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
