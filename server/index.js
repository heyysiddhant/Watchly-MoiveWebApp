const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ Allow CORS from frontend domain (Vercel + localhost)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://watchly-moive-web-app.vercel.app",
    "https://watchly-moive-web-7195w0zlc-heyysiddhants-projects.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ MongoDB connection
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

// ✅ Basic route
app.get("/", (req, res) => {
  res.send("🎬 MovieZone API is running");
});

// ✅ Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const watchlistRoutes = require("./routes/watchlist");
app.use("/api/watchlist", watchlistRoutes);
