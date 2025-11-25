const { generateEventPlan } = require("../services/eventService");
const { normalizeEventPlan } = require("../utils/mormalizeEventPlan.js");

async function generateEventRecommendations(req, res) {
  try {
    const { userId, city, time, weather } = req.body;

    if (!userId || !city) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Call service → get LLM response
    const rawResponse = await generateEventPlan(userId, city, time, weather);

    // Extract JSON inside ```json ... ```
    const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawResponse;

    if (process.env.DEBUG_GEMINI === "true") {
      console.log("Extracted JSON:\n", jsonString);
    }

    let parsedPlan;
    try {
      parsedPlan = JSON.parse(jsonString);
    } catch (err) {
      console.error("JSON Parse Error:", err);
      return res.status(500).json({ error: "Error parsing JSON response." });
    }

    // Normalize structure (optional utility)
    const normalizedPlan = normalizeEventPlan(parsedPlan);

    return res.json(normalizedPlan);

  } catch (err) {
    console.error("Error in eventController:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
}

module.exports = generateEventRecommendations;
