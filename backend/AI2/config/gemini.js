const { GoogleGenAI } = require('@google/genai');

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "models/gemini-2.0-flash";

const model = async (prompt) => {
  const contents = [{ role: "user", parts: [{ text: prompt }] }];

  try {
    const response = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents,
      config: { temperature: 0.1 },
    });

    // Extract text the correct way for the SDK
    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    if (process.env.DEBUG_GEMINI === "true") {
      console.log("🔍 Raw Gemini Response:", JSON.stringify(response, null, 2));
      console.log("✨ Extracted text:", text);
    }

    return { text, raw: response };
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    throw err;
  }
};

module.exports = model;
