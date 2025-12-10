const express = require('express');
const { rateEvent, getAverageRating } = require('../controllers/ratingController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

// Rate a single event

/**
 * @swagger
 * /api/ratings/events/{apiId}/rate:
 *   post:
 *     summary: Add or update a rating for an event
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: apiId
 *         required: true
 *         schema:
 *           type: string
 *         description: External event ID (same as used in events API)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5
 *     responses:
 *       200:
 *         description: Rating saved and average rating returned
 *       400:
 *         description: Invalid rating
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Failed to rate event
 */
router.post('/events/:apiId/rate', auth, rateEvent);
// Get average rating for a single event

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Rate events and fetch average ratings
 */

/**
 * @swagger
 * /api/ratings/events/{apiId}/average:
 *   get:
 *     summary: Get average rating (and current user's rating) for an event
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: apiId
 *         required: true
 *         schema:
 *           type: string
 *         description: External event ID
 *     responses:
 *       200:
 *         description: Average rating and optional user rating
 *       500:
 *         description: Failed to get average rating
 */
router.get('/events/:apiId/average', getAverageRating);

module.exports = router;
