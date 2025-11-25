const model = require("../config/gemini");
const { users, events } = require("../../data");

async function generateEventPlan(userId, city) {
  // Find user by ID in your data.js
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");

  // Convert event list to text for the prompt
  const filteredEvents = events.filter((e) =>
    e.city.toLowerCase().includes(city.toLowerCase())
  );

  const eventListText = filteredEvents
    .map(
      (e) => `
ID: ${e.id}
Name: ${e.name}
Category: ${e.category}
Tags: ${e.tags.join(", ")}
Date: ${e.date}${e.endDate ? " - " + e.endDate : ""}
Description: ${e.description}
  `
    )
    .join("\n");

  const prompt = `
You are a local event recommendation AI for ${city}.

User preferences:
Categories: ${user.preferences.categories.join(", ")}
Tags: ${user.preferences.tags.join(", ")}
Cities: ${user.preferences.cities.join(", ")}

Available events (filtered by city):
${eventListText}

Recommend 2–3 events that best match the user's preferences.
Return ONLY valid JSON using this structure:

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
Make sure the JSON is properly formatted.
`;

  try {
    const response = await model(prompt);

    return response.text;
  } catch (err) {
    console.error("Error in eventService:", err);
    throw new Error("Failed to generate event plan");
  }
}

module.exports = { generateEventPlan };

// If you want to ask the LLM for more complicated structured output, check the commented code below for an advanced example.

// === Advanced version (commented out) ===
// === use this if you want to experiment with more detailed JSON output ===

// const model = require("../config/gemini");

// async function generateFitnessPlan(fitnessType, frequency, experience, goal) {
//   const prompt = `
//     You are a professional fitness coach. Given the user's fitness experience, training frequency, and goal, generate a **structured fitness plan** in **JSON format**.

//   ### **Schema Requirements**:
//   The JSON response should have the following structure:

//   {
//     "fitness_plan": {
//       "experience_level": "string",
//       "goal": "string",
//       "training_frequency": "number",
//       "workout_split": [
//         {
//           "day": "string",
//           "focus": "string",
//           "exercises": [
//             {
//               "name": "string",
//               "sets": "number",
//               "reps": "string"
//             }
//           ]
//         }
//       ],
//       "diet_recommendations": {
//         "caloric_intake": "string",
//         "macronutrient_breakdown": {
//           "protein": "string",
//           "carbs": "string",
//           "fats": "string"
//         },
//         "meal_timing": "string",
//         "example_meals": [
//           {
//             "meal": "string",
//             "foods": ["string"]
//           }
//         ]
//       },
//       "recovery_tips": ["string"],
//       "warnings": ["string"]
//     }
//   }

//   ### **User Input**:
//   I am a **${experience}** individual looking to focus on **${fitnessType}**.
//   My goal is to **${goal}**, and I plan to train **${frequency}** times per week.

//   Provide a structured fitness guideline including:
//   - **Recommended exercises** with sets and reps.
//   - **Workout split** (daily training focus).
//   - **Dietary recommendations** (caloric intake, macronutrient breakdown, example meals).
//   - **Recovery tips** and **warnings** to avoid injury.
//   - **Return the response in the above JSON format**.
//   `;

//   try {
//     const result = await model(prompt);

//     // Log the raw Gemini output for debugging
//     if (process.env.DEBUG_GEMINI === "true") {
//       console.log("🔍 Raw Gemini response:", result);
//     }

//     return result.text;; // still return it to the controller
//   } catch (err) {
//     console.error("Error in fitnessService:", err);
//     throw new Error("Failed to generate fitness plan");
//   }
// }

// module.exports = { generateFitnessPlan };
