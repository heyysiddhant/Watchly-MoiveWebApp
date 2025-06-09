const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Middleware to authenticate JWT
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, 'your_jwt_secret');
    req.user = verified;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// ▶ POST: Add movie to user's watchlist
router.post('/', auth, async (req, res) => {
  const movie = req.body;

  if (!movie || !movie.imdbID || !movie.Title) {
    return res.status(400).json({ message: 'Invalid movie data' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadyExists = user.watchlist?.some((m) => m.imdbID === movie.imdbID);
    if (alreadyExists) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    user.watchlist = [...(user.watchlist || []), movie];
    await user.save();

    res.status(200).json({ message: 'Movie added to watchlist' });
  } catch (err) {
    console.error('Error adding to watchlist:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ▶ GET: Retrieve user's watchlist
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.watchlist || []);
  } catch (err) {
    console.error('Error fetching watchlist:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ▶ DELETE: Remove movie from watchlist by imdbID
router.delete('/:imdbID', auth, async (req, res) => {
  const { imdbID } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const initialLength = user.watchlist?.length || 0;
    user.watchlist = user.watchlist?.filter((movie) => movie.imdbID !== imdbID);
    
    if (user.watchlist.length === initialLength) {
      return res.status(404).json({ message: 'Movie not found in watchlist' });
    }

    await user.save();
    res.status(200).json({ message: 'Movie removed from watchlist' });
  } catch (err) {
    console.error('Error deleting from watchlist:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
