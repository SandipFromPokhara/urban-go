import { forwardRef } from "react";
import { FiMapPin, FiTarget, FiCrosshair } from "react-icons/fi";

const FloatingInput = forwardRef(({ placeholder, value, onChange, icon, type = "text", onUseLocation, className="" }, ref) => {

  const renderIcon = () => {
    if (icon === "start") return <FiMapPin className="h-5 w-5 text-gray-500" />;
    if (icon === "end") return <FiTarget className="h-5 w-5 text-gray-500" />;
    if (icon === "geo") return <FiCrosshair className="h-5 w-5 text-gray-500" />;
    return null;
  };

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full px-10 py-2 border rounded-md bg-gray-50
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-400
                      ${className}`}
        />
      {icon && (
        <span
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              (icon === "geo" || icon === "start") && onUseLocation ? "cursor-pointer" : ""
            }`}
            onClick={(icon === "geo" || icon === "start") && onUseLocation ? onUseLocation : undefined}
          >
            {renderIcon()}
          </span>
      )}
    </div>
  );
});

export default FloatingInput;
