const generateEventRecommendation = require("./services/eventService");
const normalizeAiOutput = require("./normalizeAiOutput");
const Event = require("../mocks/models/eventModel"); // or your DB model
const { events: mockEvents } = require("../mocks/server/data"); // fallback mock data

async function generateText(req, res) {
  try {
    const { city, user } = req.body;

    if (!city || !user) {
      return res.status(400).json({ message: "City and user are required." });
    }

    // Fetch events from DB
    let events = [];
    try {
      events = await Event.find({ city });
    } catch (err) {
      console.warn("DB fetch failed, using mock data", err);
    }

    // Fallback to mock data if DB is empty or failed
    if (!events || events.length === 0) {
      events = mockEvents.filter(e => e.city.toLowerCase() === city.toLowerCase());
    }

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found for this city." });
    }

    // Prepare event list text for AI
    const eventListText = events
      .map(
        e =>
          `${e.title} (${e.category}) at ${e.location} on ${e.date}: ${e.description}`
      )
      .join("\n");

    // Call Gemini AI with your prompt
    const rawResponse = await generateEventRecommendation(city, user, eventListText);

    // Extract JSON from Markdown fences if present
    const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawResponse;

    if (process.env.DEBUG_GEMINI === "true") {
      console.log("Raw AI response:", jsonString);
    }

    let parsedPlan;
    try {
      parsedPlan = JSON.parse(jsonString);
    } catch (err) {
      return res.status(500).json({ error: "Error parsing JSON response." });
    }

    const normalizedOutput = normalizeAiOutput(parsedPlan);
    res.json(normalizedOutput);

  } catch (err) {
    console.error("Error in aiController:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

module.exports = generateText;

