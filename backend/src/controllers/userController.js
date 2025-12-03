const User = require("../models/userModel");

// GET /api/users/me
const getMe = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve user profile.",
      error: error.message,
    });
  }
};

// PUT /api/users/me
const updateMe = async (req, res) => {
  const userId = req.user.userId;

  try {
    const allowedFields = ["firstName", "lastName", "dateOfBirth", "address"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    const status = error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: "Failed to update profile.",
      error: error.message,
    });
  }
};

// DELETE /api/users/me
const deleteMe = async (req, res) => {
  const userId = req.user.userId;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete account.",
      error: error.message,
    });
  }
};

module.exports = { getMe, updateMe, deleteMe };
