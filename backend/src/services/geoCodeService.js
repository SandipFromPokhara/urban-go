// backend/src/services/geoCodeService.js

const GEOCODE_BASE_URL = process.env.GEOCODE_BASE_URL?.trim();
const FALLBACK_URL = process.env.FALLBACK_URL?.trim();
const AUTOCOMPLETE_URL = process.env.AUTOCOMPLETE_URL?.trim();
const TRANSPORT_KEY = process.env.TRANSPORT_KEY;

const CAPITAL_REGIONS = ["helsinki", "espoo", "vantaa", "kauniainen"];

// Utility: check if a feature/address is in the Capital Region
const isInCapitalRegion = (feature) => {
  const region =
    (feature.properties?.localadmin || feature.address?.city || feature.address?.town || feature.address?.village || feature.address?.municipality || feature.properties?.region || "").toLowerCase();
  return CAPITAL_REGIONS.includes(region) || region === "uusimaa";
};

// Function to geocode an address
const geoCode = async (address) => {
  const cleaned = address.trim();

  try {
    const geoUrls = [
      `${GEOCODE_BASE_URL}?q=${encodeURIComponent(cleaned)}&format=json&limit=10&countrycodes=fi&addressdetails=1&extratags=1`,
      `${GEOCODE_BASE_URL}?q=${encodeURIComponent(cleaned + ", Finland")}&format=json&limit=10&countrycodes=fi&addressdetails=1&extratags=1`,
    ];

    for (const url of geoUrls) {
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const capitalData = data.filter(isInCapitalRegion);
        if (capitalData.length > 0) {
          const first = capitalData[0];
          return {
            lat: parseFloat(first.lat),
            lon: parseFloat(first.lon),
            localadmin: first.address?.city || first.address?.town || first.address?.village || "",
            region: first.address?.state || "",
            raw: first,
          };
        }
      }
    }

    // Fallback: Digitransit POI
    const poiUrl = `${FALLBACK_URL}?text=${encodeURIComponent(cleaned)}&size=5`;
    const poiRes = await fetch(poiUrl, {
      headers: { "digitransit-subscription-key": TRANSPORT_KEY },
    });
    const poiData = await poiRes.json();
    if (poiData?.features?.length > 0) {
      const capitalFeatures = poiData.features.filter(isInCapitalRegion);
      if (capitalFeatures.length > 0) {
        const f = capitalFeatures[0];
        return {
          lat: f.geometry.coordinates[1],
          lon: f.geometry.coordinates[0],
          localadmin: f.properties?.localadmin || "",
          region: f.properties?.region || "",
          raw: f,
        };
      }
    }

    return null;
  } catch (err) {
    console.error("Geocode error:", err.message);
    return null;
  }
};

// Autocomplete function
const autoSuggest = async (query) => {
  const cleaned = query.trim();
  if (!cleaned) return [];

  try {
    // Digitransit autocomplete
    const dtUrl = `${AUTOCOMPLETE_URL}?text=${encodeURIComponent(cleaned)}&size=10`;
    const dtRes = await fetch(dtUrl, {
      headers: { "digitransit-subscription-key": TRANSPORT_KEY },
    });
    const dtData = await dtRes.json();

    if (dtData?.features?.length > 0) {
      const seen = new Set();
      return dtData.features
        .filter(isInCapitalRegion)
        .map((f) => {
          const key = `${f.geometry.coordinates[0]},${f.geometry.coordinates[1]}`;
          if (seen.has(key)) return null;
          seen.add(key);
          return {
            name: f.properties.label,
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0],
            localadmin: f.properties?.localadmin || "",
            region: f.properties?.region || "",
          };
        })
        .filter(Boolean);
    }

    // Fallback Nominatim
    const nomUrl = `${GEOCODE_BASE_URL}?q=${encodeURIComponent(cleaned)}&format=json&limit=10&countrycodes=fi&addressdetails=1&extratags=1`;
    const nomRes = await fetch(nomUrl);
    const nomData = await nomRes.json();

    if (Array.isArray(nomData) && nomData.length > 0) {
      const seen = new Set();
      return nomData
        .filter(isInCapitalRegion)
        .map((r) => {
          const lat = parseFloat(r.lat);
          const lon = parseFloat(r.lon);
          const key = `${lat},${lon}`;
          if (seen.has(key)) return null;
          seen.add(key);
          return {
            name: r.address?.name || r.display_name.split(",")[0],
            lat,
            lon,
            localadmin: r.address?.city || r.address?.town || r.address?.village || "",
            region: r.address?.state || "",
          };
        })
        .filter(Boolean);
    }

    return [];
  } catch (err) {
    console.error("Autocomplete error:", err.message);
    return [];
  }
};

module.exports = { geoCode, autoSuggest };
