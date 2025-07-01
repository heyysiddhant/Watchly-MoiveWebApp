const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://watchly-moive-web-app.vercel.app"
];

// ✅ CORS middleware with preflight handling
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));

// ✅ VERY IMPORTANT: Handle OPTIONS preflight requests
app.options("*", cors());

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("🎬 MovieZone API is running");
});

// ✅ Auth routes (make sure routes/auth.js exists and is clean)
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// ✅ Watchlist routes (make sure routes/watchlist.js exists and is clean)
const watchlistRoutes = require("./routes/watchlist");
app.use("/api/watchlist", watchlistRoutes);

// ✅ Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🎬 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
