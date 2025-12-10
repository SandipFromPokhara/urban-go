// backend/geminiConfig.js

require("dotenv").config();
const { GoogleGenAI } = require('@google/genai');

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// GoogleGenerativeAI setup
const MODEL_NAME = "models/gemini-2.5-flash-lite";
// const MODEL_NAME = "models/gemini-2.5-pro";

async function model(prompt) {
  const response = await genAI.models.generateContent({
    model: MODEL_NAME,
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    config: {
      temperature: 0.3,
    },
  });

  // Extract only human-readable text
  return (
    response.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I couldn't generate a response."
  );
}

module.exports = model;