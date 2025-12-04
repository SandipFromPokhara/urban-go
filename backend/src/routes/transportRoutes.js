// backend/src/routes/transportRoutes.js

const express = require("express");
const router = express.Router();
const { getRoutes } = require("../services/routingService");
const { geoCode } = require("../services/geoCodeService");

// Capital Region cities
const CAPITAL_REGION = ["helsinki", "vantaa", "espoo", "kauniainen"];

const filterCapitalRegion = (geo) => {
  const city = (geo.raw?.properties?.localadmin || geo.raw?.address?.city || geo.raw?.address?.locality || "").toLowerCase();
  return CAPITAL_REGION.includes(city);
};

// POST /api/search-route
router.post("/", async (req, res) => {
  let fromCoords, toCoords;

  try {
    // Option 1: flat coordinates (legacy)
    if (req.body.fromLat && req.body.fromLon && req.body.toLat && req.body.toLon) {
      fromCoords = { lat: req.body.fromLat, lon: req.body.fromLon };
      toCoords = { lat: req.body.toLat, lon: req.body.toLon };
    }
    // Option 2: nested objects from frontend
    else if (req.body.from?.lat != null && req.body.from?.lon != null &&
             req.body.to?.lat != null && req.body.to?.lon != null) {
      fromCoords = { lat: req.body.from.lat, lon: req.body.from.lon };
      toCoords = { lat: req.body.to.lat, lon: req.body.to.lon };
    }
    // Option 3: resolve names via geoCode
    else if (typeof req.body.from === "string" && typeof req.body.to === "string") {
      const fromGeo = await geoCode(req.body.from);
      const toGeo = await geoCode(req.body.to);

      if (!fromGeo || !toGeo) {
        return res.status(400).json({ error: "Could not resolve origin or destination to valid coordinates." });
      }

      // Filter for Capital Region
      if (!filterCapitalRegion(fromGeo)) {
        return res.status(400).json({ error: "Origin not found in Capital Region." });
      }
      if (!filterCapitalRegion(toGeo)) {
        return res.status(400).json({ error: "Destination not found in Capital Region." });
      }

      fromCoords = { lat: fromGeo.lat, lon: fromGeo.lon };
      toCoords = { lat: toGeo.lat, lon: toGeo.lon };
    }
    else {
      return res.status(400).json({ error: "Missing coordinates" });
    }

    const itineraries = await getRoutes(fromCoords, toCoords);
    if (!itineraries.length) return res.status(404).json({ error: "No routes found." });

    return res.json({ routes: itineraries });
  } catch (err) {
    console.error("Search route error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;


