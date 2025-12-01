import { motion, AnimatePresence } from "framer-motion";
import { FaSearchLocation, FaCloudSun, FaLeaf, FaRoute } from "react-icons/fa";
import FloatingInput from "./ui/FloatingInput";
import SwapButton from "./ui/SwapButton";
import RouteList from "./RouteList";
import useTransportRouting from "../../hooks/useTransportRouting";
import useField from "../../hooks/useField";

// Safe validator for inputs
const validateInput = (value) => {
  const val = (value || "").trim();
  if (!val) return "This field is required";
  return "";
};

function SearchArea({
  date, setDate, time, setTime, routes, setRoutes, isDarkMode,
  formInputRef, activeRouteIndex, setActiveRouteIndex
}) {
  const { loading: routeLoading, searchRoute } = useTransportRouting();

  const fromField = useField("text", "", validateInput, 110);
  const toField = useField("text", "", validateInput, 110);

  const MAX_INPUT_LENGTH = 110;

  const inputClass = isDarkMode
    ? "bg-gray-700 border-gray-600 focus:ring-blue-100 text-white placeholder-gray-400"
    : "bg-gray-50 border-gray-400 focus:ring-blue-500 text-gray-900 placeholder-gray-500";

  // Swap origin/destination fields
  const handleSwap = () => {
    const temp = fromField.value;
    fromField.setValue(toField.value);
    toField.setValue(temp);
  };

  const handleSearch = async () => {
    if (!fromField.validate() || !toField.validate()) return;

    // Validate input length
    if (fromField.value.length > MAX_INPUT_LENGTH || toField.value.length > MAX_INPUT_LENGTH) {
      alert("Origin or destination address is too long!");
      return;
    }

    // Clear previous results immediately
    setRoutes([]);

    try {
      const result = await searchRoute(fromField.value, toField.value);
      if (!result || result.length === 0) {
        alert("No routes found for this query.");
        return;
      }
      setRoutes(result);
    } catch (err) {
      console.error("Search route error:", err);
      alert("Failed to fetch routes. Please try again.");
    }
  };

  const isSearchDisabled = !!fromField.error || !!toField.error || routeLoading;

  return (
    <div
      className={`p-6 rounded-2xl shadow-lg/30 flex flex-col gap-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >

      {/* Search Inputs Container */}
      <div className="flex flex-col gap-6">

        {/* Origin + Swap */}
        <div className="relative w-full max-w-md">
          <FloatingInput
            ref={formInputRef}
            type={fromField.type}
            icon="start"
            placeholder="Enter origin"
            value={fromField.value}
            onChange={fromField.onChange}
            className={`${inputClass} w-full`} // input fills container
            onUseLocation={() => {
              navigator.geolocation.getCurrentPosition(
                (pos) => fromField.setValue(`${pos.coords.latitude},${pos.coords.longitude}`),
                () => alert("Failed to get location")
              );
            }}
          />
          <motion.div
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9, rotate: -15 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <SwapButton onSwap={handleSwap} />
          </motion.div>
        </div>
        {fromField.error && <p className="text-red-500 text-sm">{fromField.error}</p>}

        {/* Destination */}
        <div className="w-full max-w-md">
          <FloatingInput
            type={toField.type}
            icon="end"
            placeholder="Enter destination"
            value={toField.value}
            onChange={toField.onChange}
            className={`${inputClass} w-full`} // same width as From input
          />
        </div>
        {toField.error && <p className="text-red-500 text-sm">{toField.error}</p>}

        {/* Date & Time */}
        <div className="flex gap-4 w-full max-w-md">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputClass} w-full px-4 py-2 border rounded-md outline-none focus:ring-2`}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`${inputClass} w-full px-4 py-2 border rounded-md outline-none focus:ring-2`}
          />
        </div>

      </div>


      {/* Search Button */}
      <button
        type="button"
        onClick={handleSearch}
        disabled={isSearchDisabled}
        className={`w-full max-w-md flex items-center justify-center gap-2 px-5 py-2 rounded-md font-semibold
            transition-all duration-200 ease-in-out cursor-pointer hover:-translate-y-1
            ${isSearchDisabled ? "bg-gray-400 cursor-not-allowed"
                               : "bg-blue-500 hover:bg-blue-600"
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

      {/* Placeholder for API-driven info (weather, CO2, distance) */}
      
      {/* Route List */}
      {routes.length > 0 && (
        <RouteList
          routes={routes}
          isDarkMode={isDarkMode}
          activeRouteIndex={activeRouteIndex}
          setActiveRouteIndex={setActiveRouteIndex}
        />
      )}
    </div>
  );
}

export default SearchArea;
