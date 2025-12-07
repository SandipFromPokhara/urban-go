// src/hooks/useTransportRouting.js

import { useState } from "react";

export default function useTransportRouting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateInput = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Field cannot be empty";
    if (trimmed.length < 3) return "Address is too short";
    // Allow Finnish/Nordic letters, numbers, and common punctuation
    const validChars = /^[a-zA-ZäöåÄÖÅ0-9,./' -]+$/;
    if (!validChars.test(trimmed)) return "Invalid characters";
    return "";
  };

  /**
   * Search transport routes
   * @param {Object} fromGeo { lat, lon, name }
   * @param {Object} toGeo { lat, lon, name }
   * @param {string|null} dateTime ISO string of date+time
   */
  const searchRoute = async (fromGeo, toGeo, dateTime = null) => {
    setError("");
    setLoading(true);

    try {
      if (
        !fromGeo?.lat ||
        !fromGeo?.lon ||
        !toGeo?.lat ||
        !toGeo?.lon
      ) {
        throw new Error("Invalid origin or destination coordinates.");
      }

      const body = {
        fromLat: fromGeo.lat,
        fromLon: fromGeo.lon,
        toLat: toGeo.lat,
        toLon: toGeo.lon,
      };

      if (dateTime) body.dateTime = dateTime;

      // Use Vite proxy: /api -> http://localhost:5001
      const res = await fetch("/api/search-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Unknown error fetching routes");

      return data.routes || [];
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, validateInput, searchRoute };
}
