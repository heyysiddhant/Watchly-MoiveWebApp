const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ Dynamic CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://watchly-moive-web-app.vercel.app"
      
    ];

    if (
      !origin || // Allow Postman or curl
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));

// ✅ JSON Parser
app.use(express.json());

// ✅ MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

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

// ✅ Routes
app.get("/", (req, res) => {
  res.send("🎬 MovieZone API is running");
});

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const watchlistRoutes = require("./routes/watchlist");
app.use("/api/watchlist", watchlistRoutes);
