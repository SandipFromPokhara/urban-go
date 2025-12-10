const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/adminMiddleware");
const {
  getAllUsers,
  getUserDetails,
  deleteReview,
  getAllReviews,
  getAdminStats,
  updateUserRole,
  deleteUser
} = require("../controllers/adminController");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin routes
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get overall admin statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics about users, reviews and events
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

router.get("/stats", auth, requireAdmin, getAdminStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users with their comments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/users", auth, requireAdmin, getAllUsers);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   get:
 *     summary: Get details for a single user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     responses:
 *       200:
 *         description: User details with comments
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.get("/users/:userId", auth, requireAdmin, getUserDetails);

/**
 * @swagger
 * /api/admin/users/{userId}/role:
 *   patch:
 *     summary: Update a user's role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin, superadmin]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid user ID or role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not allowed to modify this role
 *       404:
 *         description: User not found
 */
router.patch("/users/:userId/role", auth, requireAdmin, updateUserRole);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID or attempting to delete self
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not allowed to delete this user
 *       404:
 *         description: User not found
 */
router.delete("/users/:userId", auth, requireAdmin, deleteUser);

/**
 * @swagger
 * /api/admin/reviews:
 *   get:
 *     summary: Get all reviews/comments
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [reports, recent]
 *         description: Sort by most reported (default) or most recent
 *     responses:
 *       200:
 *         description: List of reviews
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/reviews", auth, requireAdmin, getAllReviews);

/**
 * @swagger
 * /api/admin/reviews/{commentId}:
 *   delete:
 *     summary: Delete a review/comment
 *     tags: [Admin]
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
 *       400:
 *         description: Invalid comment ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Comment not found
 */
router.delete("/reviews/:commentId", auth, requireAdmin, deleteReview);

module.exports = router;
