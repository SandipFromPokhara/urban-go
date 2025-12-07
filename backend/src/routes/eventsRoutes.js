const express = require("express");
const router = express.Router();
const { query, param } = require("express-validator");

const {
  getEvents,
  getEventById,
  refreshEvents,
  getCategories,
} = require("../controllers/eventsController");

const authMiddleware = require("../middlewares/authMiddleware");

// IMPORTANT: specific routes before generic "/:id"

// @route   GET /api/events/categories
// @desc    Get unique event categories
// @access  Public
router.get("/categories", getCategories);

// @route   GET /api/events
// @desc    Get paginated list of events with filtering
// @access  Public
router.get(
  "/",
  query("start").optional().isString().withMessage("Start date must be a string"),
  query("end").optional().isString().withMessage("End date must be a string"),
  query("keyword").optional().isString().withMessage("Keyword must be a string"),
  query("text").optional().isString().withMessage("Text search must be a string"),
  query("location").optional().isString().withMessage("Location must be a string"),
  query("sort").optional().isString().withMessage("Sort must be a string"),
  query("language")
    .optional()
    .isIn(["en", "fi", "sv"])
    .withMessage("Language must be en, fi, or sv"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("page_size")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Page size must be between 1 and 100"),
  query("categoryText")
    .optional()
    .isString()
    .withMessage("categoryText must be a string"),
  getEvents
);

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get(
  "/:id",
  param("id").notEmpty().withMessage("Event ID is required"),
  query("language")
    .optional()
    .isIn(["en", "fi", "sv"])
    .withMessage("Language must be en, fi, or sv"),
  getEventById
);

// @route   POST /api/events/refresh
// @desc    Force refresh events cache from API (Admin only)
// @access  Private
router.post(
  "/refresh",
  authMiddleware,
  query("start").optional().isString().withMessage("Start date must be a string"),
  query("end").optional().isString().withMessage("End date must be a string"),
  query("language")
    .optional()
    .isIn(["en", "fi", "sv"])
    .withMessage("Language must be en, fi, or sv"),
  query("page_size")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Page size must be between 1 and 100"),
  refreshEvents
);

module.exports = router;
