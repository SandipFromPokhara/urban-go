// src/components/transport/ui/SwapButton.jsx

import { FiRepeat } from "react-icons/fi";

export default function SwapButton({ onSwap }) {
  return (
    <button
      onClick={onSwap}
      className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
    >
      <FiRepeat className="text-xl" />
    </button>
  );
}
