import { motion, AnimatePresence } from "framer-motion";
import { FaSearchLocation, FaCloudSun, FaLeaf, FaRoute } from "react-icons/fa";
import FloatingInput from "./ui/FloatingInput";
import SwapButton from "./ui/SwapButton";
import RouteList from "./RouteList";
import useHSLRouting from "../../hooks/useHSLRouting";
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
  const { loading: routeLoading, searchRoute } = useHSLRouting();

  const fromField = useField("text", "", validateInput);
  const toField = useField("text", "", validateInput);

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

    try {
      const result = await searchRoute(fromField.value, toField.value);
      if (result) setRoutes(result);
    } catch (err) {
      alert(err.message);
    }
  };

  const isSearchDisabled = !!fromField.error || !!toField.error || routeLoading;

  return (
    <div
      className={`p-6 rounded-2xl shadow-lg/30 flex flex-col gap-5 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Origin */}
      <FloatingInput
        ref={formInputRef}
        type={fromField.type}
        icon="start"
        placeholder="Enter origin"
        value={fromField.value}
        onChange={fromField.onChange}
        className={inputClass}
        onUseLocation={() => {
          navigator.geolocation.getCurrentPosition(
            (pos) => fromField.setValue(`${pos.coords.latitude},${pos.coords.longitude}`),
            () => alert("Failed to get location")
          );
        }}
      />
      {fromField.error && <p className="text-red-500 text-sm">{fromField.error}</p>}

      {/* Swap button */}
      <div className="flex justify-center">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9, rotate: -15 }}
          className="cursor-pointer"
        >
          <SwapButton onSwap={handleSwap} />
        </motion.div>
      </div>

      {/* Destination */}
      <FloatingInput
        type={toField.type}
        icon="end"
        placeholder="Enter destination"
        value={toField.value}
        onChange={toField.onChange}
        className={inputClass}
      />
      {toField.error && <p className="text-red-500 text-sm">{toField.error}</p>}

      {/* Date & Time */}
      <div className="flex gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2 ${inputClass}`}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2 ${inputClass}`}
        />
      </div>

      {/* Search Button */}
      <button
        type="button"
        onClick={handleSearch}
        disabled={isSearchDisabled}
        className={`flex items-center justify-center gap-2 px-5 py-2 rounded-md font-semibold
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

      {/* Quick Info */}
      <AnimatePresence>
        {routes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-3 gap-3 mt-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-blue-50 p-3 rounded-xl shadow-sm border border-blue-100"
            >
              <FaCloudSun className="text-2xl text-blue-500 mb-1" />
              <p className="text-sm font-semibold text-gray-800">9°C</p>
              <p className="text-xs text-gray-500">Cloudy</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-green-50 p-3 rounded-xl shadow-sm border border-green-100"
            >
              <FaLeaf className="text-2xl text-green-600 mb-1" />
              <p className="text-sm font-semibold text-gray-800">0g CO₂</p>
              <p className="text-xs text-gray-500">Eco-friendly</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center bg-yellow-50 p-3 rounded-xl shadow-sm border border-yellow-100"
            >
              <FaRoute className="text-2xl text-yellow-600 mb-1" />
              <p className="text-sm font-semibold text-gray-800">11 km</p>
              <p className="text-xs text-gray-500">Distance</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
