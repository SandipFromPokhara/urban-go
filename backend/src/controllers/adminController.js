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
    // Count users and comments from database
    const [userCount, commentCount] = await Promise.all([
      User.countDocuments(),
      Comment.countDocuments(),
    ]);

    // Fetch recent users (last 5)
    const recentUsers = await User.find()
      .select("firstName lastName email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // Fetch total events from external API
    let totalEvents = 0;
    try {
      const eventsUrl = process.env.EVENTS_URL || "https://api.hel.fi/linkedevents/v1";
      const response = await fetch(`${eventsUrl}/event/?page_size=1`);
      const data = await response.json();
      totalEvents = data.meta?.count || 0;
    } catch (apiError) {
      console.error("Error fetching events count:", apiError);
      totalEvents = 0;
    }

    res.status(200).json({
      totalUsers: userCount,
      totalReviews: commentCount,
      totalEvents: totalEvents,
      recentUsers: recentUsers
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:userId/role
// @access  Admin (superadmin can modify admins, regular admin cannot)
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error("Invalid user ID");
    }

    if (!["user", "admin", "superadmin"].includes(role)) {
      res.status(400);
      throw new Error("Invalid role. Must be 'user', 'admin', or 'superadmin'");
    }

    // Get the target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      res.status(404);
      throw new Error("User not found");
    }

    // Only superadmin can modify admin/superadmin roles
    if ((targetUser.role === "superadmin" || role === "superadmin") && req.user.role !== "superadmin") {
      res.status(400);
      throw new Error("Only super admin can modify superadmin roles");
    }

    // Regular admins cannot modify other admins
    if (targetUser.role === "admin" && req.user.role !== "superadmin") {
      res.status(400);
      throw new Error("Only super admin can modify admin users");
    }

    // Update the role
    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({ 
      user: {
        _id: targetUser._id,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        email: targetUser.email,
        role: targetUser.role
      }, 
      message: "Role updated successfully" 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:userId
// @access  Admin (superadmin can delete admins, regular admin cannot)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error("Invalid user ID");
    }

    // Prevent deleting yourself
    if (userId === req.user.userId) {
      res.status(400);
      throw new Error("Cannot delete your own account");
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Only superadmin can delete admin or superadmin users
    if ((user.role === "admin" || user.role === "superadmin") && req.user.role !== "superadmin") {
      res.status(403);
      throw new Error("Only super admin can delete admin users");
    }

    // Delete all user's comments
    await Comment.deleteMany({ user: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  deleteReview,
  getAllReviews,
  getAdminStats,
  updateUserRole,
  deleteUser
};
