// backend/src/routes/weatherRoutes.js

const express = require("express");
const { getWeather } = require("../services/weatherService");

const router = express.Router();

router.get("/", async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: "Missing coordinates" });
    }

    try {
        const weather = await getWeather(lat, lon);
        res.json(weather);
    } catch (e) {
        console.error("WEATHER ERROR", e.stack || e);
        res.status(500).json({ error: "Weather fetch failed" });
    }
});

module.exports = router;