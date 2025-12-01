// backend/src/routes/transportRoutes.js

const express = require("express");
const router = express.Router();
//const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Validate input addresses
const validate = (txt) => {
  if (!txt || txt.trim().length < 3) return false;
  const valid = /^[a-zA-ZäöåÄÖÅ0-9,./' -]+$/;
  return valid.test(txt.trim());
};

// Route: /api/search-route
router.post("/search-route", async (req, res) => {
  console.log("Received /api/search-route POST:", req.body);
  const { from, to } = req.body;

  if (!validate(from) || !validate(to)) {
    return res.status(400).json({ error: "Invalid addresses." });
  }

  // Geocode function
  const GEOCODE_BASE_URL = (process.env.GEOCODE_BASE_URL || "").trim();
  if (!GEOCODE_BASE_URL)
    return res.status(500).json({ error: "Geocode base URL not configured" });

  const geoCode = async (address) => {
    try {
      const cleaned = address.trim();
      const urls = [
        `${GEOCODE_BASE_URL}?q=${encodeURIComponent(cleaned)}&format=json&limit=1&countrycodes=fi`,
        `${GEOCODE_BASE_URL}?q=${encodeURIComponent(cleaned + ", Finland")}&format=json&limit=1&countrycodes=fi`,
      ];
      for (const url of urls) {
        console.log("Fetching geo for:", address, "URL:", url);
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0)
          return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
      return null;
    } catch (err) {
      console.error("GeoCode error:", err.message);
      return null;
    }
  };

  try {
    const fromCoords = await geoCode(from);
    const toCoords = await geoCode(to);

    if (!fromCoords || !toCoords) {
      return res.status(404).json({ error: "One or both addresses not found." });
    }

    const query = `{
            plan(
                from: {lat: ${fromCoords.lat}, lon: ${fromCoords.lon}}
                to: {lat: ${toCoords.lat}, lon: ${toCoords.lon}}
                numItineraries: 5
            ) {
                itineraries {
                    duration
                    walkDistance
                    legs {
                        mode
                        startTime
                        endTime
                        distance
                        from { name lat lon }
                        to { name lat lon }
                        route { shortName longName }
                    }
                }
            }
        }`;

    const transportUrl = process.env.TRANSPORT_URL;
    const transportUrlResponse = await fetch(transportUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "digitransit-subscription-key": process.env.TRANSPORT_KEY,
      },
      body: JSON.stringify({ query }),
    });

    if (!transportUrlResponse.ok) {
      const text = await transportUrlResponse.text();
      console.error(
        "Transportation API HTTP error:",
        transportUrlResponse.status,
        text
      );
      return res.status(transportUrlResponse.status).json({ error: text });
    }

    let result;
    try {
      result = await transportUrlResponse.json();
    } catch {
      const text = await transportUrlResponse.text();
      console.error("Transportation API invalid JSON:", text);
      return res.status(500).json({ error: "Invalid JSON from Transportation API" });
    }

    if (!result?.data?.plan?.itineraries) {
      console.warn("Transportation API returned no routes:", result);
      return res.status(404).json({ error: "No routes found" });
    }

    const routes = result.data.plan.itineraries.map((it, i) => {
      // Convert "SUBWAY" to "metro"
      const modes = it.legs.map((leg) => {
        let m = leg.mode.toLowerCase();
        if (m === "subway") m = "metro";
        if (m === "rail") m = "train";
        return {
            m,
            duration: Math.round((leg.endTime - leg.startTime) / 60000),
            from: { name: leg.from.name, lat: leg.from.lat, long:leg.from.lon },
            to: { name: leg.to.name, lat: leg.to.lat, lon: leg.to.lon },
            distance: leg.distance,
            routeName: leg.route?.shortName || leg.route?.longName || null,
            startTime: leg.startTime,
            endTime: leg.endTime
        };
      });

      // Build polyline as array og [lat, lon]
      const polyline = [];
      it.legs.forEach((leg, idx) => {
        if (idx === 0) polyline.push([leg.from.lat, leg.from.lon]);
        polyline.push([leg.to.lat, leg.to.lon]);
      });

      return {
        name: `Route ${i + 1}`,
        duration: Math.round(it.duration / 60),
        steps: it.legs.map((leg) => {
          const line = leg.route?.shortName ? `(${leg.route.shortName})` : "";
          let mode = leg.mode.toLowerCase();
          if (mode === "subway") mode = "metro";
          if (mode === "rail") mode = "train";
          return `${mode.toUpperCase()}${line}: ${leg.from.name} → ${leg.to.name}`;
        }),
        modes,
        position: [it.legs[0].from.lat, it.legs[0].from.lon],
        polyline,
      };
    });

    return res.json({ routes });
  } catch (err) {
    console.error("Unexpected error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
