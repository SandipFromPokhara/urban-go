// src/components/transport/ui/AutoCompleteInput.jsx

import { useState, useRef, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AutoCompleteInput = forwardRef(function AutoCompleteInput(
  {
    value,
    suggestions = [],
    setSelectedGeo,
    handleManualInput,
    placeholder,
    className,
    onKeyDown,
  },
  inputRef
) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    setOpen(suggestions.length > 0);
  }, [suggestions]);

  const selectItem = (item) => {
    if (!item) return;
    setSelectedGeo(item);
    handleManualInput(item.name || "");
    setOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div ref={wrapperRef} className="w-full relative">
      <input
        ref={inputRef} 
        value={value}
        onChange={(e) => handleManualInput(e.target.value)}
        placeholder={placeholder}
        className={className}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => (i + 1 < suggestions.length ? i + 1 : 0));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) =>
              i <= 0 ? suggestions.length - 1 : i - 1
            );
          } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            selectItem(suggestions[activeIndex]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
          onKeyDown?.(e);
        }}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-0 right-0 mt-1 bg-white shadow-md rounded-md max-h-64 overflow-y-auto z-50 border"
          >
            {suggestions.map((item, i) => (
              <div
                key={i}
                onMouseDown={() => selectItem(item)}
                className={`p-2 cursor-pointer ${
                  i === activeIndex ? "bg-gray-200" : ""
                }`}
              >
                {item.name}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default AutoCompleteInput;
