// frontend/src/hooks/useAutoComplete.js

import { useState, useEffect, useRef } from "react";

const capitalRegionCities = ["helsinki", "vantaa", "espoo", "kauniainen"];

const useAutoComplete = (inputValue, setInputValue) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedGeo, setSelectedGeo] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(inputValue)}`);
        if (!res.ok) return setSuggestions([]);
        const json = await res.json();

        // Filter only valid Capital Region features
        const validFeatures = (json || []).filter((f) => {
          if (!f.geometry?.coordinates?.length) return false;
          const props = f.properties || {};
          const localadmin = (props.localadmin || "").toLowerCase();
          const region = (props.region || "").toLowerCase();
          return capitalRegionCities.includes(localadmin) || region === "uusimaa";
        });

        setSuggestions(validFeatures);
      } catch (err) {
        console.error("Autocomplete fetch failed:", err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [inputValue]);

  const selectSuggestion = (suggestion) => {
    if (!suggestion?.geometry?.coordinates?.length) {
      console.warn("Selected suggestion has no coordinates:", suggestion);
      return;
    }
    setSelectedGeo(suggestion);
    setInputValue(suggestion.properties.label || suggestion.name);
    setSuggestions([]);
  };

  return { suggestions, selectedGeo, selectSuggestion, setSelectedGeo };
};

export default useAutoComplete;
