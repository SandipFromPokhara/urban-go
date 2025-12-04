const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Add or update a rating
const rateEvent = async (req, res) => {
  const userId = req.user.userId;
  const { rating } = req.body;
  const apiId = req.params.apiId;
  const apiIdstr = String(apiId);

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Invalid rating" });
  }

  try {
    const user = await User.findById(userId);

    const existing = user.reviews.find((r) => r.apiId === apiIdstr);
    if (existing) {
      existing.rating = rating;
      existing.updatedAt = new Date();
    } else {
      user.reviews.push({ apiId: apiIdstr, rating, comment: "" });
    }

    await user.save();

    // Calculate average rating for current event
    const allUsers = await User.find({ "reviews.apiId": apiIdstr });
    let total = 0,
      count = 0;
    allUsers.forEach((u) => {
      u.reviews.forEach((r) => {
        if (r.apiId === apiIdstr) {
          total += r.rating;
          count++;
        }
      });
    });
    const averageRating = count ? total / count : 0;

    res.status(200).json({ averageRating });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to rate event", error: err.message });
  }
};

// Get average rating for a single event
const getAverageRating = async (req, res) => {
  const { apiId } = req.params;
  const apiIdstr = String(apiId);

  // auth only for getting user-specific rating
  let userId = null;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      console.warn("Invalid token:", err.message);
    }
  }

  try {
    const allUsers = await User.find({ "reviews.apiId": apiIdstr });
    let total = 0,
      count = 0;
    let userRating = null;
    allUsers.forEach((u) => {
      u.reviews.forEach((r) => {
        if (r.apiId === apiIdstr) {
          total += r.rating;
          count++;
          if (userId && u._id.equals(userId)) {
            userRating = r.rating;
          }
        }
      });
    });

    const averageRating = count ? total / count : 0;
    res.status(200).json({ averageRating, userRating });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get average rating", error: err.message });
  }
};

module.exports = { rateEvent, getAverageRating };
