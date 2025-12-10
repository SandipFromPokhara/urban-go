// backend/services/aiService.js

const model = require("../config/gemini");

const CAPITAL_REGION_CITIES = [
  "helsinki",
  "espoo",
  "vantaa",
  "kauniainen",
];

function inferCity(text) {
  const lower = text.toLowerCase();
  const found = CAPITAL_REGION_CITIES.find(city => lower.includes(city));
  return found
    ? found.charAt(0).toUpperCase() + found.slice(1)
    : "Capital Region";
}

function inferStructuredData(message) {
  const text = message.toLowerCase();

  return {
    intent:
      text.includes("route") || text.includes("transport")
        ? "find_routes"
        : "find_events",
    params: {
      city: inferCity(text),
      time: text.includes("today")
        ? "today"
        : text.includes("tomorrow")
        ? "tomorrow"
        : text.includes("weekend")
        ? "weekend"
        : "unspecified",
      categories: text.includes("music")
        ? ["music"]
        : text.includes("sports")
        ? ["sports"]
        : [],
      popular: false,
      include_routes: false,
    },
  };
}

function extractGeminiText(result) {
  if (!result) return "Sorry, no response from AI.";

  if (typeof result === "string") return result;

  return (
    result?.text?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I couldn’t generate a response right now."
  );
}

async function generateEventRecommendation(userMessage) {
  if (!userMessage) {
    return {
      text: "Tell me what you’re looking for and I’ll help.",
      structured: { intent: "unknown", params: {} },
    };
  }

  const structured = inferStructuredData(userMessage);

  const prompt = `
You are UrbanGo’s AI assistant.
UrbanGo covers only Finland’s Capital Region.
Assume events are always in this region.
Never ask which city.
Never ask follow-up questions.
Answer confidently and naturally.

User request:
"${userMessage}"
`;

  try {
    const aiResult = await model(prompt);
    const text = extractGeminiText(aiResult);

    return {
      text,
      structured,
    };
  } catch (err) {
    console.error("❌ AI service error:", err);

    return {
      text: "Sorry, I’m having trouble right now. Please try again in a moment.",
      structured,
    };
  }
}

module.exports = generateEventRecommendation;
