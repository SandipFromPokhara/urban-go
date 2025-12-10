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

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Browse and manage events
 */

/**
 * @swagger
 * /api/events/categories:
 *   get:
 *     summary: Get unique event categories
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of categories derived from events
 *       500:
 *         description: Failed to fetch categories
 */
router.get("/categories", getCategories);

// @route   GET /api/events
// @desc    Get paginated list of events with filtering
// @access  Public

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get paginated list of events with filtering
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *         description: Start date (e.g. today, 2025-12-10)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *         description: End date
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: LinkedEvents keyword filter
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         description: Free text search
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           enum: [helsinki, espoo, vantaa]
 *         description: City filter
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [date, recent, name]
 *         description: Sort order
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           enum: [en, fi, sv]
 *         description: Response language
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (default 1)
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Page size (default 20)
 *       - in: query
 *         name: categoryText
 *         schema:
 *           type: string
 *         description: Category text filter
 *       - in: query
 *         name: keywords
 *         schema:
 *           type: string
 *         description: Comma-separated list of category keywords
 *     responses:
 *       200:
 *         description: Paginated list of events
 *       500:
 *         description: Failed to fetch events
 */

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

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get single event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: External event ID
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           enum: [en, fi, sv]
 *         description: Response language (default en)
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 *       500:
 *         description: Failed to fetch event
 */
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

/**
 * @swagger
 * /api/events/refresh:
 *   post:
 *     summary: Force refresh events cache from external API
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           enum: [en, fi, sv]
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Events cache refreshed or no events to refresh
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to refresh events
 */
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
