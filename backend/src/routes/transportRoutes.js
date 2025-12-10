// backend/src/routes/transportRoutes.js

const express = require("express");
const router = express.Router();
const { getRoutes } = require("../services/transRoutingService");
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

/**
 * @swagger
 * tags:
 *   name: Transport
 *   description: Public transport route search
 */

/**
 * @swagger
 * /api/search-route:
 *   post:
 *     summary: Find public transport routes between two locations
 *     tags: [Transport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 description: Flat coordinates
 *                 required: [fromLat, fromLon, toLat, toLon]
 *                 properties:
 *                   fromLat:
 *                     type: number
 *                   fromLon:
 *                     type: number
 *                   toLat:
 *                     type: number
 *                   toLon:
 *                     type: number
 *                   dateTime:
 *                     type: string
 *                     format: date-time
 *                     description: Optional departure time
 *               - type: object
 *                 description: Nested coordinates
 *                 required: [from, to]
 *                 properties:
 *                   from:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lon:
 *                         type: number
 *                       name:
 *                         type: string
 *                   to:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lon:
 *                         type: number
 *                       name:
 *                         type: string
 *                   dateTime:
 *                     type: string
 *                     format: date-time
 *               - type: object
 *                 description: Place names to be geocoded
 *                 required: [from, to]
 *                 properties:
 *                   from:
 *                     type: string
 *                     description: Origin name (must be in Capital Region)
 *                   to:
 *                     type: string
 *                     description: Destination name (must be in Capital Region)
 *                   dateTime:
 *                     type: string
 *                     format: date-time
 *           example:
 *             from: "Helsinki"
 *             to: "Espoo"
 *             dateTime: "2025-12-10T08:30:00Z"
 *     responses:
 *       200:
 *         description: List of itineraries between origin and destination
 *       400:
 *         description: Invalid input or locations outside Capital Region
 *       404:
 *         description: No routes found
 *       500:
 *         description: Server error
 */

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
