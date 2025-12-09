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

// Admin routes - all require auth + admin role
router.get("/stats", auth, requireAdmin, getAdminStats);
router.get("/users", auth, requireAdmin, getAllUsers);
router.get("/users/:userId", auth, requireAdmin, getUserDetails);
router.patch("/users/:userId/role", auth, requireAdmin, updateUserRole);
router.delete("/users/:userId", auth, requireAdmin, deleteUser);
router.get("/reviews", auth, requireAdmin, getAllReviews);
router.delete("/reviews/:commentId", auth, requireAdmin, deleteReview);

module.exports = router;
