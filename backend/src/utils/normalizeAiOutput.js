// backend/normalizeOutput.js

function normalizeAiOutput(output = {}) {
  return {
    intent:
      output.intent === "find_events" || output.intent === "find_routes"
        ? output.intent
        : "unknown",

        city: typeof output.city === "string"
      ? output.city
      : "unspecified",
      time: typeof output.time === "string"
      ? output.time
      : "unspecified",

    categories: Array.isArray(output.categories)
      ? output.categories
      : [],

    popular: typeof output.popular === "boolean"
      ? output.popular
      : false,

    include_routes: typeof output.include_routes === "boolean"
      ? output.include_routes
      : false
  };
}

module.exports = normalizeAiOutput;

