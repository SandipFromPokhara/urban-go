const User = require("../models/userModel");

// Add or update a rating
const rateEvent = async (req, res) => {
  const userId = req.user.userId;
  const { rating } = req.body;
  const { eventId } = req.params;
  const eventIdstr = String(eventId);

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Invalid rating" });
  }

  try {
    const user = await User.findById(userId);

    const existing = user.reviews.find((r) => r.eventId === eventIdstr);
    if (existing) {
      existing.rating = rating;
      existing.updatedAt = new Date();
    } else {
      user.reviews.push({ eventId: eventIdstr, rating, comment: "" });
    }

    await user.save();

    // Calculate average rating for current event
    const allUsers = await User.find({ "reviews.eventId": eventIdstr });
    let total = 0,
      count = 0;
    allUsers.forEach((u) => {
      u.reviews.forEach((r) => {
        if (r.eventId === eventIdstr) {
          total += r.rating;
          count++;
        }
      });
    });
    const averageRating = count ? total / count : 0;

    const existingReview = user.reviews.find((r) => r.eventId === eventIdstr);
    if (existingReview) {
      // Update existing rating
      existingReview.rating = rating;
      existingReview.createdAt = new Date();
    } else {
      // Add new rating
      user.reviews.push({ eventId: eventIdstr, rating });
    }
    await user.save();

    res.status(200).json({ averageRating });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to rate event", error: err.message });
  }
};

// Get average rating for a single event
const getAverageRating = async (req, res) => {
  const { eventId } = req.params;

  try {
    const eventIdstr = String(eventId);
    const allUsers = await User.find({ "reviews.eventId": eventIdstr });
    let total = 0,
      count = 0;
    allUsers.forEach((u) => {
      u.reviews.forEach((r) => {
        if (r.eventId === eventIdstr) {
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
      .json({ message: "Failed to get average rating", error: err.message });
  }
};

module.exports = { rateEvent, getAverageRating };
