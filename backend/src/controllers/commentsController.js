const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Add a new comment
const addComment = async (req, res) => {
  const userId = req.user?.userId;
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

    const populatedComment = await Comment.findById(newComment._id)
      .populate("user", "firstName lastName role");

    res.status(201).json(populatedComment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
};

// Get comments for an event
const getCommentsForEvent = async (req, res) => {
  const { apiId } = req.params;
  const userIdentifier = req.ip; // unique per device

  const comments = await Comment.find({ apiId }).populate("user", "firstName lastName role");
  const mappedComments = comments.map(c => {
    const commentObj = c.toObject();
    delete commentObj.reportedBy;
    commentObj.isReported = c.reportedBy?.includes(userIdentifier) || false;
    return commentObj;
  });

  res.status(200).json(mappedComments);
};

// Delete a comment
const deleteComment = async (req, res) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only owner, admin, or superadmin can delete
    const isOwner = comment.user.toString() === userId;
    const isPrivileged = role === "admin" || role === "superadmin";
    if (!isOwner && !isPrivileged) {
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

// Report a comment
const reportComment = async (req, res) => {
  console.log("Reporting comment:", req.params.commentId);

  try {
    const userIdentifier = req.ip; // unique per user/device for unauthenticated reporting
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const alreadyReported = comment.reportedBy.includes(userIdentifier);

    if (alreadyReported) {
      // UNREPORT
      comment.reports -= 1;
      comment.reportedBy = comment.reportedBy.filter(id => id !== userIdentifier);
    } else {
      // REPORT
      comment.reports += 1;
      comment.reportedBy.push(userIdentifier);
    }

    await comment.save();

    res.status(200).json({
      message: alreadyReported ? "Report removed" : "Comment reported",
      reports: comment.reports,
      isReported: !alreadyReported
    });

  } catch (err) {
    console.error("Report error:", err);

    res.status(500).json({ message: "Failed to report comment", error: err.message });
  }
};


module.exports = {
  addComment,
  getCommentsForEvent,
  deleteComment,
  reportComment,
};
