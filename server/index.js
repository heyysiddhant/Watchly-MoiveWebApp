const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ CORS config for localhost + Vercel
const allowedOrigins = [
  "http://localhost:5173",
  "https://watchly-moive-web-app.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("❌ CORS: " + origin));
    }
  },
  credentials: true,
}));

// ✅ CRITICAL: handle browser preflight (OPTIONS) requests
app.options("*", cors());

app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🎬 MovieZone API is running");
});

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/watchlist", require("./routes/watchlist"));

// ✅ MongoDB
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
