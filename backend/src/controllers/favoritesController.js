const User = require("../models/userModel");

const addToFavorites = async (req, res) => {
  const userId = req.user.userId;
  const { eventId, title, date, image, category } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the event is already in favorites
    const alreadyFavorite = user.favorites.some(
      (fav) => fav.eventId === eventId
    );
    if (alreadyFavorite) {
      return res.status(400).json({ message: "Event already in favorites." });
    }

    // Add to favorites
    user.favorites.push({ eventId, title, date, image, category });
    await user.save();

    res.status(200).json({ message: "Event added to favorites.", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to favorites.", error: error.message });
  }
};

// Remove from favorites
const removeFromFavorites = async (req, res) => {
  const userId = req.user.userId;
  const eventId = req.params.eventId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.favorites = user.favorites.filter(
      (fav) => fav.eventId !== eventId
    );
    await user.save();

    res.status(200).json({ message: "Event removed from favorites.", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove from favorites.", error: error.message });
  }
};

// Get user's favorites
const getFavorites = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Failed to get favorites.", error: error.message });
  }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
};