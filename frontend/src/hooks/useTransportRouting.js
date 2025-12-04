// src/hooks/useTransportRouting.js

import { useState } from "react";
const API_URL = import.meta.env.VITE_API  || "http://localhost:5001";

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

    const searchRoute = async (from, to, dateTime) => {
        setError("");
        setLoading(true);
    
    try {
        const body = {
            fromLat: from.lat,
            fromLon: from.lon,
            toLat: to.lat,
            toLon: to.lon,
        }

        if (dateTime) {
            body.dateTime = dateTime;
        }

        const res = await fetch (`${API_URL}/api/search-route`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        console.log("API_URL:", API_URL);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unknown error");

        return data.routes;
    } catch (e) {
        setError(e.message);
        return null;
    } finally {
        setLoading(false);
    }
  };

  return { loading, error, validateInput, searchRoute };
}