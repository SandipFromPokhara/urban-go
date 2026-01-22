// frontend/src/components/transport/SearchArea.jsx

import { useRef, forwardRef } from "react";
import { FaSearchLocation, FaMapMarkerAlt, FaFlagCheckered } from "react-icons/fa";
import AutoCompleteInput from "./ui/AutoCompleteInput";
import SwapButton from "./ui/SwapButton";
import RouteTimeline from "./RouteTimeline";
import useTransportRouting from "../../hooks/useTransportRouting";
import useField from "../../hooks/useField";
import useAutoComplete from "../../hooks/useAutoComplete";
import polyline from "@mapbox/polyline";
import { createAutoCompleteKeyHandler } from "../../hooks/useAutoCompleteHandlers";

const validateInput = (value) => (!value?.trim() ? "This field is required" : "");

const SearchArea = forwardRef(function SearchArea(
  { date, setDate, time, setTime, routes, setRoutes, isDarkMode, activeRouteIndex, setActiveRouteIndex },
  formInputRef
) {
  const { loading: routeLoading, searchRoute } = useTransportRouting();

  const fromField = useField("text", "", validateInput, 110);
  const toField = useField("text", "", validateInput, 110);

  const {
    suggestions: fromSuggestions,
    selectedGeo: fromSelectedGeo,
    selectSuggestion: selectFromSuggestion,
    setSelectedGeo: setFromSelectedGeo,
    handleManualInput: handleFromInput,
  } = useAutoComplete(fromField.value, fromField.setValue);

  const {
    suggestions: toSuggestions,
    selectedGeo: toSelectedGeo,
    selectSuggestion: selectToSuggestion,
    setSelectedGeo: setToSelectedGeo,
    handleManualInput: handleToInput,
  } = useAutoComplete(toField.value, toField.setValue);

  const fromWrapperRef = useRef(null);
  const toWrapperRef = useRef(null);

  const inputClass = isDarkMode
    ? "bg-gray-700 border-gray-600 focus:ring-blue-100 text-white placeholder-gray-400 px-4 py-3 rounded-md"
    : "bg-gray-50 border-gray-400 focus:ring-blue-500 text-gray-900 placeholder-gray-500 px-4 py-3 rounded-md";

  const handleSwap = () => {
    const tempVal = fromField.value;
    fromField.setValue(toField.value);
    toField.setValue(tempVal);

    const tempGeo = fromSelectedGeo;
    selectFromSuggestion(toSelectedGeo || null);
    selectToSuggestion(tempGeo || null);
  };

  const resolveInput = async (value, selected, name) => {
    if (selected?.lat != null && selected?.lon != null) return selected;
    if (!value.trim()) throw new Error(`Please enter a valid ${name}.`);

    const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(value)}`);
    if (!res.ok) throw new Error(`Failed to fetch ${name} suggestions.`);

    const json = await res.json();
    if (!json || !json.length) throw new Error(`No results found for ${name}.`);

    return json[0];
  };

  const formatRoutes = (itineraries) => {
    return itineraries.map((itinerary) => {
      const legs = itinerary.legs || [];
      const routePolylines = [];
      let startPoint = null;

      const steps = legs.map((leg) => {
        const start = leg.startTime ? new Date(leg.startTime) : null;
        const end = leg.endTime ? new Date(leg.endTime) : null;
        const duration = start && end ? Math.round((end - start) / 60000) : 0;

        // Decode polyline
        let decodedPolyline = [];
        if (leg.legGeometry?.points) {
          decodedPolyline = polyline.decode(leg.legGeometry.points).map(([lat, lng]) => ({ lat, lng }));
          routePolylines.push(...decodedPolyline);
        }

        // Capture start point
        if (!startPoint && leg.from?.lat && leg.from?.lon) {
          startPoint = { lat: leg.from.lat, lng: leg.from.lon };
        }

        const intermediateStops = (leg.intermediatePlaces || []).map((ip) => ({
          name: ip.name || ip.stop?.name || "",
          code: ip.stop?.code || "",
          lat: ip.stop?.lat || null,
          lon: ip.stop?.lon || null,
          platform: ip.stop?.platformCode || "",
          zone: ip.stop?.zoneId || null,
        }));

        // Collect all zones for this leg
        const legZones = [
          leg.from?.stop?.zoneId,
          ...intermediateStops.map((s) => s.zone).filter(Boolean),
          leg.to?.stop?.zoneId,
        ].filter(Boolean);

        return {
          mode: leg.mode?.toLowerCase() || "",
          from_name: leg.from?.name || fromField.value,
          to_name: leg.to?.name || toField.value,
          distance: leg.distance ? (leg.distance / 1000).toFixed(2) : 0,
          duration,
          startTime: start ? start.toISOString() : null,
          endTime: end ? end.toISOString() : null,
          routeShortName: leg.route?.shortName || "",
          routeLongName: leg.route?.longName || "",
          zones: legZones,
          intermediateStops,
          stepPolyline: decodedPolyline
        };
      });

      const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);

      return {
        origin: steps[0]?.from_name || fromField.value,
        destination: steps[steps.length - 1]?.to_name || toField.value,
        duration: totalDuration,
        modes: steps.map((s) => ({ m: s.mode, duration: s.duration })),
        steps,
        polyline: routePolylines, // <-- used by MapSection
        position: startPoint
      };
    });
  };

  const handleSearch = async () => {
    try {
      const from = await resolveInput(fromField.value, fromSelectedGeo, "origin");
      const to = await resolveInput(toField.value, toSelectedGeo, "destination");

      setRoutes([]);

      const dateTime = date && time ? new Date(`${date}T${time}`).toISOString() : null;

      const result = await searchRoute(
        { lat: from.lat, lon: from.lon, name: from.name },
        { lat: to.lat, lon: to.lon, name: to.name },
        dateTime
      );

      if (!result?.length) {
        alert("No routes found for this query.");
        return;
      }

      const formatted = formatRoutes(result);
      setRoutes(formatted);
      setActiveRouteIndex(0);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to fetch routes.");
    }
  };

  const isSearchDisabled = fromField.error || toField.error || routeLoading;

  const handleFromKeyDown = createAutoCompleteKeyHandler({
    suggestions: fromSuggestions,
    activeIndex: 0,
    setActiveIndex: () => {},
    setFieldValue: fromField.setValue,
    setSelectedGeo: setFromSelectedGeo,
  });

  const handleToKeyDown = createAutoCompleteKeyHandler({
    suggestions: toSuggestions,
    activeIndex: 0,
    setActiveIndex: () => {},
    setFieldValue: toField.setValue,
    setSelectedGeo: setToSelectedGeo,
  });

  return (
    <div className={`p-6 rounded-2xl shadow-lg/30 flex flex-col gap-6 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div ref={fromWrapperRef} className="relative w-full max-w-md">
        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500 z-10">
          <FaMapMarkerAlt className="text-blue-300 text-sm" />
        </div>
        <AutoCompleteInput
          ref={formInputRef}
          value={fromField.value}
          suggestions={fromSuggestions}
          setSelectedGeo={selectFromSuggestion}
          handleManualInput={handleFromInput}
          placeholder="Enter origin"
          className={`${inputClass} pl-7 w-full`}
          onKeyDown={handleFromKeyDown}
        />
        <SwapButton onSwap={handleSwap} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-50" />
        {fromField.error && <p className="text-red-500 text-sm mt-1">{fromField.error}</p>}
      </div>

      <div ref={toWrapperRef} className="relative w-full max-w-md">
        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500 z-10">
          <FaFlagCheckered className="text-red-300 text-sm" />
        </div>
        <AutoCompleteInput
          value={toField.value}
          suggestions={toSuggestions}
          setSelectedGeo={selectToSuggestion}
          handleManualInput={handleToInput}
          placeholder="Enter destination"
          className={`${inputClass} pl-7 w-full`}
          onKeyDown={handleToKeyDown}
        />
        {toField.error && <p className="text-red-500 text-sm mt-1">{toField.error}</p>}
      </div>

      <div className="flex gap-4 w-full max-w-md">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${inputClass} w-full`} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`${inputClass} w-full`} />
      </div>

      <button
        type="button"
        onClick={handleSearch}
        disabled={isSearchDisabled}
        className={`w-full max-w-md flex items-center justify-center gap-2 px-5 py-3 rounded-md font-semibold transition-all duration-200 ease-in-out cursor-pointer hover:-translate-y-1 ${
          isSearchDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        {routeLoading ? (
          <svg className="animate-spin h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        ) : (
          <>
            <FaSearchLocation />
            Search Routes
          </>
        )}
      </button>

      {routes.length > 0 && (
        <RouteTimeline
          routes={routes}
          isDarkMode={isDarkMode}
          activeRouteIndex={activeRouteIndex}
          setActiveRouteIndex={setActiveRouteIndex}
          fromInput={fromField.value}
          toInput={toField.value}
        />
      )}
    </div>
  );
});

export default SearchArea;