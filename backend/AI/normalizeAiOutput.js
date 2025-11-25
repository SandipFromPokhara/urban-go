function normalizeAiOutput(output) {
  let AiOutput = output;

  // If the output is still a JSON string, try parsing it
  if (typeof AiOutput === "string") {
    try {
      AiOutput = JSON.parse(AiOutput);
    } catch (err) {
      console.error("❌ Failed to parse output JSON:", err);
      return { recommendation: [] }
    }
  }

  // Ensure the simplified schema with safe defaults
  return AiOutput;
}

module.exports = normalizeAiOutput;

