const express = require("express");
const router = express.Router();
const Event = require("../mocks/models/eventModel");
const generateEventRecommendation = require("./aiController");

router.post("/", async (req, res) => {
  try {
    const { city, user } = req.body;

    if (!city || !user) {
      return res.status(400).json({ error: "city and user are required" });
    }

    // Fetch events from MongoDB
    const events = await Event.find({ city });
    const eventListText = events
      .map(e => `${e.title}: ${e.description || ""}`)
      .join(", ");

    // Call your AI function
    const recommended = await generateEventRecommendation(city, user, eventListText);

    res.json({ recommended_events: recommended });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
