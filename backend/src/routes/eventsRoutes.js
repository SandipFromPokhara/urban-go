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

/**
 * @route   GET /api/events
 * @desc    Get paginated list of events with filtering
 * @access  Public
 * @query   start, end, category, language, page, page_size, search
 */
router.get(
  "/",
  [
    query("start")
      .optional()
      .isString()
      .withMessage("Start date must be a string"),
    query("end")
      .optional()
      .isString()
      .withMessage("End date must be a string"),
    query("category")
      .optional()
      .isString()
      .withMessage("Category must be a string"),
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
    query("search")
      .optional()
      .isString()
      .withMessage("Search must be a string"),
  ],
  getEvents
);

/**
 * @route   GET /api/events/categories
 * @desc    Get unique event categories
 * @access  Public
 */
router.get("/categories", getCategories);

/**
 * @route   GET /api/events/:id
 * @desc    Get single event by ID
 * @access  Public
 * @params  id - Event API ID
 * @query   language
 */
router.get(
  "/:id",
  [
    param("id").notEmpty().withMessage("Event ID is required"),
    query("language")
      .optional()
      .isIn(["en", "fi", "sv"])
      .withMessage("Language must be en, fi, or sv"),
  ],
  getEventById
);

/**
 * @route   POST /api/events/refresh
 * @desc    Force refresh events cache from API (Admin only)
 * @access  Private/Admin
 * @query   start, end, language, page_size
 */
router.post(
  "/refresh",
  authMiddleware, // Requires authentication
  [
    query("start")
      .optional()
      .isString()
      .withMessage("Start date must be a string"),
    query("end")
      .optional()
      .isString()
      .withMessage("End date must be a string"),
    query("language")
      .optional()
      .isIn(["en", "fi", "sv"])
      .withMessage("Language must be en, fi, or sv"),
    query("page_size")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Page size must be between 1 and 100"),
  ],
  refreshEvents
);

module.exports = router;