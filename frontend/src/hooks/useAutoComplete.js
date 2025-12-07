// src/hooks/useAutoComplete.js
import { useState, useEffect, useRef } from "react";

const CAPITAL_REGION_CITIES = ["helsinki", "vantaa", "espoo", "kauniainen"];

const useAutoComplete = (inputValue, setInputValue) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedGeo, setSelectedGeo] = useState(null);
  const timeoutRef = useRef(null);
  const skipNextFetchRef = useRef(false);

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }

    if (!inputValue || inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    // Debounce the input
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(inputValue)}`);
        if (!res.ok) {
          setSuggestions([]);
          return;
        }

        const data = await res.json();

        // Filter only features in Capital Region or Uusimaa
        const validFeatures = (data || []).filter((f) => {
          if (f.lat == null || f.lon == null) return false;

          const localadmin = (f.localadmin || "").toLowerCase();
          const region = (f.region || "").toLowerCase();

          return (
            CAPITAL_REGION_CITIES.includes(localadmin) ||
            region === "uusimaa"
          );
        });

        setSuggestions(validFeatures);
      } catch (err) {
        console.error("Autocomplete fetch failed:", err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [inputValue]);

  // Explicit selection handler (mouse / keyboard)
  const selectSuggestion = (suggestion) => {
    if (!suggestion) {
      setSelectedGeo(null);
      return;
    }

    if (suggestion.lat == null || suggestion.lon == null) {
      console.warn("Selected suggestion has invalid coordinates:", suggestion);
      return;
    }

    skipNextFetchRef.current = true;

    setSelectedGeo(suggestion);
    setInputValue(suggestion.name || suggestion.label || "");
    setSuggestions([]);
  };

  return {
    suggestions,
    selectedGeo,
    selectSuggestion,     // for mouse
    setSelectedGeo,       // for keyboard
  };
};

export default useAutoComplete;
