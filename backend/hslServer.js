// backend/hslServer.js

require("dotenv").config();
const express = require("express");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Validate input addresses
const validate = (txt) => {
    if (!txt || txt.trim().length < 3) return false;
    const valid = /^[a-zA-ZäöåÄÖÅ0-9,./' -]+$/;
    return valid.test(txt.trim());
};

// Route: /api/search-route
app.post("/api/search-route", async (req, res) => {
    console.log("Received /api/search-route POST:", req.body);
    const { from, to } = req.body;

    if (!validate(from) || !validate(to)) {
        return res.status(400).json({ error: "Invalid addresses." });
    }

    // Geocode function
    const geoCode = async (address) => {
        try {
            const cleaned = address.trim();
            const urls = [
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleaned)}&format=json&limit=1&countrycodes=fi`,
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleaned + ", Finland")}&format=json&limit=1&countrycodes=fi`
            ];
            for (const url of urls) {
                console.log("Fetching geo for:", address, "URL:", url);
                const response = await fetch(url);
                const data = await response.json();
                if (data.length > 0) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
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

        const HSLUrl = "https://api.digitransit.fi/routing/v2/hsl/gtfs/v1";
        const hslResponse = await fetch(HSLUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "digitransit-subscription-key": process.env.HSL_KEY
            },
            body: JSON.stringify({ query }),
        });

        if (!hslResponse.ok) {
            const text = await hslResponse.text();
            console.error("HSL API HTTP error:", hslResponse.status, text);
            return res.status(hslResponse.status).json({ error: text });
        }

        let result;
        try {
            result = await hslResponse.json();
        } catch {
            const text = await hslResponse.text();
            console.error("HSL API invalid JSON:", text);
            return res.status(500).json({ error: "Invalid JSON from HSL API" });
        }

        if (!result?.data?.plan?.itineraries) {
            console.warn("HSL API returned no routes:", result);
            return res.status(404).json({ error: "No routes found" });
        }

        const routes = result.data.plan.itineraries.map((it, i) => ({
            name: `Route ${i + 1}`,
            duration: Math.round(it.duration / 60),
            steps: it.legs.map((leg) => {
                const line = leg.route?.shortName ? `(${leg.route.shortName})` : "";
                return `${leg.mode}${line}: ${leg.from.name} → ${leg.to.name}`;
            }),
            modes: it.legs.map((leg) => leg.mode.toLowerCase()),
            position: [it.legs[0].from.lat, it.legs[0].from.lon],
        }));

        return res.json({ routes });

    } catch (err) {
        console.error("Unexpected error:", err.message);
        return res.status(500).json({ error: "Server error" });
    }
});

app.listen(3001, () => console.log("Backend running on port 3001"));
