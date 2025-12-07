// backend/src/routes/transportRoutes.js

const express = require("express");
const router = express.Router();
const { getRoutes } = require("../services/routingService");
const { geoCode } = require("../services/geoCodeService");

// Capital Region cities
const CAPITAL_REGIONS = ["helsinki", "vantaa", "espoo", "kauniainen"];

// Check if a location is in Capital Region
const isInCapitalRegion = (feature) => {
  const city =
    (feature.localadmin || feature.address?.city || feature.address?.town || "").toLowerCase();
  const region = (feature.region || feature.address?.state || "").toLowerCase();
  return CAPITAL_REGIONS.includes(city) || region === "uusimaa";
};

// POST /api/search-route
router.post("/", async (req, res) => {
  let fromCoords, toCoords;

  try {
    console.log("Search request body:", req.body);

    // Case 1: flat coordinates
    if (req.body.fromLat && req.body.fromLon && req.body.toLat && req.body.toLon) {
      fromCoords = { lat: req.body.fromLat, lon: req.body.fromLon };
      toCoords = { lat: req.body.toLat, lon: req.body.toLon };
    } 
    // Case 2: nested objects { lat, lon, name }
    else if (req.body.from?.lat != null && req.body.from?.lon != null &&
             req.body.to?.lat != null && req.body.to?.lon != null) {
      fromCoords = { lat: req.body.from.lat, lon: req.body.from.lon };
      toCoords = { lat: req.body.to.lat, lon: req.body.to.lon };
    } 
    // Case 3: resolve via names (strings)
    else if (typeof req.body.from === "string" && typeof req.body.to === "string") {
      const fromGeo = await geoCode(req.body.from);
      const toGeo = await geoCode(req.body.to);

      console.log("Resolved geocodes:", { fromGeo, toGeo });

      if (!fromGeo || !toGeo) {
        return res.status(400).json({ error: "Could not resolve origin or destination." });
      }

      // Capital Region check
      if (!isInCapitalRegion(fromGeo)) {
        return res.status(400).json({ error: `Origin "${req.body.from}" is outside Capital Region.` });
      }
      if (!isInCapitalRegion(toGeo)) {
        return res.status(400).json({ error: `Destination "${req.body.to}" is outside Capital Region.` });
      }

      fromCoords = { lat: fromGeo.lat, lon: fromGeo.lon };
      toCoords = { lat: toGeo.lat, lon: toGeo.lon };
    } 
    else {
      return res.status(400).json({ error: "Missing coordinates or invalid format." });
    }

    console.log("Using coordinates:", { fromCoords, toCoords });

    const itineraries = await getRoutes(fromCoords, toCoords, req.body.dateTime);

    if (!itineraries || !itineraries.length) {
      return res.status(404).json({ error: "No routes found." });
    }

    return res.json({ routes: itineraries });
  } catch (err) {
    console.error("Search route error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
