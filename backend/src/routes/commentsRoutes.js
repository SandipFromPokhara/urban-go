const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  addComment,
  getCommentsForEvent,
  deleteComment,
  reportComment,
} = require("../controllers/commentsController");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Event comments
 */

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Add a new comment to an event
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [apiId, comment]
 *             properties:
 *               apiId:
 *                 type: string
 *                 description: Event identifier (same as used in events API)
 *               comment:
 *                 type: string
 *                 description: Comment text
 *     responses:
 *       201:
 *         description: Comment created
 *       400:
 *         description: Missing apiId or comment
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to add comment
 */
router.post("/", auth, addComment);

/**
 * @swagger
 * /api/comments/{apiId}:
 *   get:
 *     summary: Get comments for an event
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: apiId
 *         required: true
 *         schema:
 *           type: string
 *         description: Event identifier
 *     responses:
 *       200:
 *         description: List of comments for the event
 *       500:
 *         description: Failed to fetch comments
 */
router.get("/:apiId", getCommentsForEvent);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment (owner, admin, or superadmin)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to delete this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Failed to delete comment
 */
router.delete("/:commentId", auth, deleteComment);

/**
 * @swagger
 * /api/comments/{commentId}/report:
 *   post:
 *     summary: Toggle report status for a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment reported or report removed
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Failed to report comment
 */
router.post("/:commentId/report", reportComment);

module.exports = router;
