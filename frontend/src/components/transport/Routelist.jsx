import { motion } from "framer-motion";
import { FaBus, FaWalking, FaTrain, FaClock } from "react-icons/fa";

function RouteList({ routes }) {
  if (!routes || routes.length === 0) return null;

  return (
    <div className="mt-6 space-y-3">
      {routes.map((route, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 bg-gray-50 border rounded-lg shadow-sm hover:bg-blue-50 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-800">Route Option {index + 1}</p>
            <div className="flex items-center gap-2 text-gray-600">
              <FaClock />
              <span>{route.duration} mins</span>
            </div>
          </div>

          <div className="flex gap-2 mt-2 text-sm text-gray-600">
            {route.modes.map((mode, i) => (
              <div key={i} className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-md">
                {mode === "bus" && <FaBus />}
                {mode === "walk" && <FaWalking />}
                {mode === "train" && <FaTrain />}
                {mode}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default RouteList;
