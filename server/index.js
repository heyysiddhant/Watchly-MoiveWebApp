const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`🎬 Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Test route
app.get("/", (req, res) => {
  res.send("🎬 MovieZone API is running");
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const watchlistRoutes = require('./routes/watchlist');
app.use('/api/watchlist', watchlistRoutes);

