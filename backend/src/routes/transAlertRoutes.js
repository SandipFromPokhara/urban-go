// src/routes/alertsRoutes.js
const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const ALERT_URL = process.env.ALERT_URL;

router.get("/", async (req, res) => {
  const query = `
    {
      alerts {
        alertHeaderText
        alertDescriptionText
        effectiveStartDate
        effectiveEndDate
        entities {
          __typename
          ... on Route { gtfsId }
          ... on Stop { gtfsId }
        }
      }
    }
  `;

  try {
    const response = await fetch(ALERT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    res.json(data.data.alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

module.exports = router;
