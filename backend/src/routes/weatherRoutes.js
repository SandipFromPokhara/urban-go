// backend/src/routes/weatherRoutes.js

const express = require("express");
const { getWeather } = require("../services/weatherService");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: Current weather for a coordinate
 */

/**
 * @swagger
 * /api/weather:
 *   get:
 *     summary: Get current weather for given coordinates
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude of the location
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude of the location
 *     responses:
 *       200:
 *         description: Weather data from the external API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Raw or slightly transformed weather response
 *             example:
 *               temperature: 3.5
 *               feelsLike: 0.8
 *               description: "Light rain"
 *               icon: "10d"
 *       400:
 *         description: Missing coordinates
 *       500:
 *         description: Weather fetch failed
 */
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