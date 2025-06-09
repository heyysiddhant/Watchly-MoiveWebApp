// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  watchlist: [
    {
      imdbID: String,
      Title: String,
      Year: String,
      Poster: String,
      Type: String,
    }
  ],
});

module.exports = mongoose.model('User', userSchema);