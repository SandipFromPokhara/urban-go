const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const eventRoutes = require("./routes/eventRouter");
const transportRoutes = require("./routes/transportRouter");
const userRoutes = require("./routes/userRouter");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Simple test route
app.get("/", (req, res) => {
  res.send("Backend server is running ✅");
});

// API Routes
app.use("/api/events", eventRoutes);
app.use("/api/transports", transportRoutes);
app.use("/api/users", userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Local MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/urbango";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB (Local)");
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    console.log("Make sure MongoDB service is running");
  });