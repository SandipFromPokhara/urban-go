const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const connectDB = require("./src/config/db");
const authMiddleware = require("./src/middlewares/authMiddleware");
const authRoutes = require("./src/routes/authRoutes");

console.log("AUTH ROUTES:", authRoutes); 
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();

// Simple test route
app.get("/", (req, res) => {
  res.send("Backend server is running ✅");
});

// Protected route: requires a valid JWT token
app.get("/api/protectedroute", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted to protected route!",
    user: req.user
  });
});

// API Routes
app.use("/api/auth", authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.TEST_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Test server listening on port ${PORT}`);
});