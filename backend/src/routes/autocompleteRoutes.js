// backend/src/routes/autocompleteRoutes.js

const express = require("express");
const router = express.Router();
const { autoSuggest } = require("../services/geoCodeService");

// GET /api/autocomplete?q=...
router.get("/", async (req, res) => {
  const q = req.query.q || "";
  if (q.length < 2) return res.json([]);

  try {
    const suggestions = await autoSuggest(q);
    return res.json(suggestions);
  } catch (err) {
    console.error("Autocomplete error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
