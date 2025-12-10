require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require('path');

// NEW: Swagger imports
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Import routes
const connectDB = require("./src/config/db");
const { unknownEndpoint,errorHandler } = require("./src/middlewares/customMiddleware");
const authMiddleware = require("./src/middlewares/authMiddleware");
const authRoutes = require("./src/routes/authRoutes");
const favoritesRoutes = require("./src/routes/favoritesRoutes");
const commentsRoutes = require("./src/routes/commentsRoutes");
const eventsRoutes = require("./src/routes/eventsRoutes");
const transportRoutes = require("./src/routes/transportRoutes");
const transAlertRoutes = require("./src/routes/transAlertRoutes");
const autocompleteRoutes = require("./src/routes/autocompleteRoutes");
const weatherRoutes = require("./src/routes/weatherRoutes");
const aiRoutes = require("./src/routes/aiRoutes");
const userRoutes = require("./src/routes/userRoutes");
const ratingRoutes = require("./src/routes/ratingRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'view')));

// Connect to database
connectDB();

// NEW: Swagger config (before routes)
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "UrbanGo API",
      version: "1.0.0",
      description: "API documentation for UrbanGo backend",
    },
    servers: [
      { url: "http://localhost:5001", description: "Local dev" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // scan all route files for JSDoc annotations
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Transportation API route
app.use("/api/search-route", transportRoutes);
app.use("/api/autocomplete", autocompleteRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/alerts", transAlertRoutes);
app.use("/api/ai", aiRoutes);

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
app.use("/api/users", userRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api", unknownEndpoint);
app.use(errorHandler);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

module.exports = app;