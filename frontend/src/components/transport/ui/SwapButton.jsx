// src/components/transport/ui/SwapButton.jsx

import { FiRepeat } from "react-icons/fi";
import { motion } from "framer-motion";

export default function SwapButton({ onSwap, className = "", ...motionProps }) {
  return (
    <motion.button
      {...motionProps}
      onClick={onSwap}
      aria-label="Swap origin and destination"
      className={`
        p-2 sm:p-3 md:p-2 rounded-full 
        bg-blue-500 text-white hover:bg-blue-600 shadow-md
        flex items-center justify-center transition-transform
        ${className}
      `}
      whileHover={{ scale: 1.1, rotate: 20 }}
      whileTap={{ scale: 0.9, rotate: -15 }}
    >
      <FiRepeat className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4" />
    </motion.button>
  );
}
