const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  addFavorite,
  removeFavorite,
  getFavorites
} = require("../controllers/favoritesController");

router.use(auth); // user must be logged in
/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Manage a user's favorite events
 */

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get current user's favorite events
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorites for the authenticated user
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 */
router.get("/", getFavorites);

/**
 * @swagger
 * /api/favorites/{eventId}:
 *   post:
 *     summary: Add an event to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: External event ID (from events API)
 *     responses:
 *       200:
 *         description: Event added to favorites
 *       400:
 *         description: Event already in favorites or other validation error
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Event or user not found
 *       500:
 *         description: Failed to add favorite
 */
router.post("/:eventId", addFavorite);

/**
 * @swagger
 * /api/favorites/{eventId}:
 *   delete:
 *     summary: Remove an event from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: External event ID (from events API)
 *     responses:
 *       200:
 *         description: Event removed from favorites
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to remove favorite
 */
router.delete("/:eventId", removeFavorite);


module.exports = router;
