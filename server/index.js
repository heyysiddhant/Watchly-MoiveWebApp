const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // ✅ Load .env variables

const app = express();

// ✅ CORS Setup for Local & Vercel Frontend
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://watchly-moive-web-app.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: false // ❌ No cookies/session, so this is false
}));

// ✅ Body parser
app.use(express.json());

// ✅ Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`🎬 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

// ✅ Basic route
app.get("/", (req, res) => {
  res.send("🎬 MovieZone API is running");
});

// ✅ Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const watchlistRoutes = require("./routes/watchlist");
app.use("/api/watchlist", watchlistRoutes);