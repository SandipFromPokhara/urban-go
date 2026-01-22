// src/routes/transAlertRoutes.js
require("dotenv").config();
const express = require("express");
const router = express.Router();
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");

const ALERT_URL = process.env.ALERT_URL;

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
