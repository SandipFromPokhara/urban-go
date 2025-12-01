require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import routes
const connectDB = require("./src/config/db");
const authMiddleware = require("./src/middlewares/authMiddleware");
const authRoutes = require("./src/routes/authRoutes");
const favoritesRoutes = require("./src/routes/favoritesRoutes");
const commentsRoutes = require("./src/routes/commentsRoutes");
const eventsRoutes = require("./src/routes/eventsRoutes");
const transportRoutes = require("./src/routes/transportRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Transportation API route
app.use("/api", transportRoutes);

// Protected route: requires a valid JWT token
app.get("/api/protectedroute", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted to protected route!",
    user: req.user
  });
});

// User API Routes
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/events", eventsRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Connect to database
connectDB();

const PORT = process.env.TEST_PORT || 5001;
app.listen(PORT, () => {
  console.log(`Test server listening on port ${PORT}`);
});