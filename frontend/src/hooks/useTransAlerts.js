// frontend/src/hooks/useTransAlerts.js

import { useState, useEffect } from "react";

export const useTransAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("/api/alerts");
        const data = await res.json();

        // Map backend fields to match MapInfoPanel props
        const formatted = Array.isArray(data)
          ? data.map(a => ({
              header: a.header,
              description: a.description,
              url: a.url,
              effectiveStart: a.effectiveStart,
              effectiveEnd: a.effectiveEnd,
            }))
          : [];

        setAlerts(formatted);
      } catch (err) {
        console.error("Failed to fetch transport alerts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return { alerts, loading };
};
