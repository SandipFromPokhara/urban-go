// src/routes/transAlertRoutes.js
require("dotenv").config();
const express = require("express");
const router = express.Router();
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");

const ALERT_URL = process.env.ALERT_URL;

/**
 * @swagger
 * tags:
 *   name: TransAlerts
 *   description: Public transport disruption alerts
 */

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get current public transport alerts
 *     tags: [TransAlerts]
 *     responses:
 *       200:
 *         description: List of active or recent alerts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   header:
 *                     type: string
 *                     description: Short title of the alert
 *                   description:
 *                     type: string
 *                     description: Detailed description of the disruption
 *                   url:
 *                     type: string
 *                     description: Optional URL with more information
 *                   effectiveStart:
 *                     type: integer
 *                     format: int64
 *                     description: Start time (Unix timestamp, seconds)
 *                   effectiveEnd:
 *                     type: integer
 *                     format: int64
 *                     nullable: true
 *                     description: End time (Unix timestamp, seconds) or null
 *                   routes:
 *                     type: array
 *                     description: Affected route IDs
 *                     items:
 *                       type: string
 *             example:
 *               - header: "Tram service disruption"
 *                 description: "Tram 3 is not running between Stop A and Stop B due to track maintenance."
 *                 url: "https://example.com/alerts/123"
 *                 effectiveStart: 1733817600
 *                 effectiveEnd: 1733839200
 *                 routes: ["3"]
 *       500:
 *         description: Failed to fetch alerts from GTFS-RT source
 */
router.get("/", async (req, res) => {
  try {
    const response = await fetch(ALERT_URL);
    const buffer = await response.arrayBuffer(); // GTFS-RT is protobuf
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    // Map GTFS alerts to a simpler JSON structure for your frontend
    const alerts = feed.entity
      .filter(e => e.alert) // only keep entities with alerts
      .map(e => {
        const alert = e.alert;
        return {
          header: alert.headerText?.translation[0]?.text || "",
          description: alert.descriptionText?.translation[0]?.text || "",
          url: alert.url?.translation[0]?.text || "",
          effectiveStart: alert.activePeriod?.[0]?.start || null,
          effectiveEnd: alert.activePeriod?.[0]?.end || null,
          routes: alert.informedEntity?.map(entity => entity.routeId).filter(Boolean) || [],
        };
      });

    res.json(alerts);
  } catch (err) {
    console.error("Failed to fetch GTFS-RT alerts:", err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

module.exports = router;
