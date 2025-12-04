const Comment = require("../models/commentModel");
const User = require("../models/userModel");

// Add a new comment
const addComment = async (req, res) => {
  const userId = req.user.userId;
  const { apiId, comment } = req.body;
  const username = req.user.firstName + " " + req.user.lastName;

  if (!apiId || !comment) {
    return res.status(400).json({ message: "Missing apiId or comment" });
  }

  try {
    const newComment = await Comment.create({
      apiId,
      user: userId,
      username: username,
      comment,
    });
    // link comment to user
    await User.findByIdAndUpdate(userId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json(newComment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
};

// Get comments for an event
const getCommentsForEvent = async (req, res) => {
  const { apiId } = req.params;

  try {
    const comments = await Comment.find({ apiId }).populate("user", "firstName lastName role");
    res.status(200).json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to load comments", error: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const userId = req.user.userId;
  const role = req.user.role;
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only owner or admin can delete
    if (comment.user.toString() !== userId && role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    // remove comment reference from user
    await User.findByIdAndUpdate(comment.user, {
      $pull: { comments: commentId },
    });

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete comment", error: error.message });
  }
};

module.exports = {
  addComment,
  getCommentsForEvent,
  deleteComment,
};
