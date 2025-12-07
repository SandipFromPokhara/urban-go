const User = require("../models/userModel");
const Comment = require("../models/commentModel");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate({ path: "comments", select: "apiId comment createdAt reports" })
      .sort({ createdAt: -1 });
    
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get user details
// @route   GET /api/admin/users/:userId
// @access  Admin
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate({ path: "comments", select: "apiId comment createdAt reports" });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete review/comment
// @route   DELETE /api/admin/reviews/:commentId
// @access  Admin
const deleteReview = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!commentId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error("Invalid comment ID");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404);
      throw new Error("Comment not found");
    }

    await User.findByIdAndUpdate(comment.user, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get all reviews
// @route   GET /api/admin/reviews
// @access  Admin
const getAllReviews = async (req, res) => {
  try {
    const { sort = "reports" } = req.query;
    const sortOption = sort === "recent" ? { createdAt: -1 } : { reports: -1, createdAt: -1 };

    const reviews = await Comment.find()
      .populate({ path: "user", select: "firstName lastName email" })
      .sort(sortOption);

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Admin
const getAdminStats = async (req, res) => {
  try {
    const [userCount, commentCount, reportedComments] = await Promise.all([
      User.countDocuments(),
      Comment.countDocuments(),
      Comment.countDocuments({ reports: { $gt: 0 } })
    ]);

    const roleDistribution = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    res.status(200).json({
      totalUsers: userCount,
      totalComments: commentCount,
      reportedComments,
      recentUsers,
      roles: roleDistribution.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  deleteReview,
  getAllReviews,
  getAdminStats
};
