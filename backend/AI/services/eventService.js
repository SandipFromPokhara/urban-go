const model = require("../config/gemini");

async function generateEventRecommendation(city, user, eventListText) {
  const prompt = `
        You are a local event recommendation AI for ${city}.

        User preferences:
        Categories: ${user.preferences.categories.join(", ")}
        Tags: ${user.preferences.tags.join(", ")}
        Cities: ${user.preferences.cities.join(", ")}

        Available events (filtered by city):
        ${eventListText}

        {
        "recommended_events": [
            {
            "id": 0,
            "name": "string",
            "description": "string",
            "reasons_for_recommendation": "string"
            }
            ]
        }
        `;
  try {
    const result = await model(prompt);
    return result.text;
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    return {
      recommended_events: [
        {
          id: 1,
          name: "Mock Event",
          description: "Demo event",
          reasons_for_recommendation: "Fallback for presentation",
        },
      ],
    };
  }
}

module.exports = generateEventRecommendation;

/*
try {
    const response = await model(prompt); // call your Gemini wrapper
    const text = response?.text; // extract the .text property
    if (!text) throw new Error("No text returned from Gemini");

    if (process.env.DEBUG_GEMINI === "true") {
      console.log("🔍 Raw AI text:", text);
    }

    return text; // return text to your controller
  } catch (err) {
    console.error("Error in eventService:", err);
    throw new Error("Failed to generate events");
  }*/
