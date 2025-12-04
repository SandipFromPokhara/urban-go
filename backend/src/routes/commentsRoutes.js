const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  addComment,
  getCommentsForEvent,
  deleteComment
} = require("../controllers/commentsController");

// only authenticated users can add or delete comments
router.post("/", auth, addComment);
router.get("/:apiId", getCommentsForEvent);
router.delete("/:commentId", auth, deleteComment);

module.exports = router;
