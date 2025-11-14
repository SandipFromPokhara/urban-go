import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware (optional for now)
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("Backend server is running ✅");
});

// Port setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
