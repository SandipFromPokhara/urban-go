// src/components/transport/ui/SwapButton.jsx

import { FiRepeat } from "react-icons/fi";
import { motion } from "framer-motion";

export default function SwapButton({ onSwap, className, ...motionProps }) {
  return (
    <motion.button
      {...motionProps}
      onClick={onSwap}
      className={`p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md transition ${className}`}
    >
      <FiRepeat className="text-sm" />
    </motion.button>
  );
}