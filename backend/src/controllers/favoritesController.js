const User = require("../models/userModel");
const Event = require("../models/eventModel");
const LinkedEventsService = require("../services/linkedEventsService");

const addFavorite = async (req, res) => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const eventId = req.params.eventId;

    // fetch user from DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already in favorites
    const exists = user.favorites.find(f => f.eventId === eventId);
    if (exists) {
      return res.status(400).json({ error: "Event already in favorites" });
    }

    // Try to find event in DB
    let event = await Event.findOne({ apiId: eventId });

    // If not found → fetch from API
    if (!event) {
      const response = await LinkedEventsService.fetchEventById(eventId);
      if (!response.success) {
        return res.status(404).json({ error: "Event not found" });
      }
      const transformed = LinkedEventsService.transformEvent(response.data);
      event = await Event.create(transformed);
    }

    // Save event info in user favorites list
    user.favorites.push({
      eventId,
      title: event.name?.en || event.name?.fi || "Untitled Event",
      description: event.description?.en || event.description?.fi || "",
      date: event.startTime,
      location: event.location?.name?.en || event.location?.name?.fi || "TBA",
      image: event.images?.[0]?.url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
      category: event.categories?.[0] || "other",
      tags: event.categories || [],
    });

    await user.save();
    res.json({ message: "Added to favorites", favorites: user.favorites });
  } catch (error) {
    console.error("Add favorite error:", error);
    res.status(500).json({ error: error.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const eventId = req.params.eventId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.favorites = user.favorites.filter(f => f.eventId !== eventId);
    await user.save();

    res.json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      count: user.favorites.length,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
};
