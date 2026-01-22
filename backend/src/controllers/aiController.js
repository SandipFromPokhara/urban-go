const generateEventRecommendation = require("../services/aiService");

async function generateText(req, res) {
  try {
    const { message, conversation } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // Build conversation string
    let conversationText = "";
    if (conversation && Array.isArray(conversation)) {
      conversationText = conversation
        .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.text}`)
        .join("\n");
    }

    // Send latest message + conversation to AI service
    const aiResponse = await generateEventRecommendation(message, conversationText);

   res.json({
      text: aiResponse.text,
      structured: aiResponse.structured,
    });
  } catch (err) {
    console.error("AI controller error:", err.message);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
}

module.exports = generateText;