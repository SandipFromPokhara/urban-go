// frontend/src/hooks/useAutoCompleteHandlers.js

export const createAutoCompleteKeyHandler = ({
  suggestions,
  activeIndex,
  setActiveIndex,
  setFieldValue,
  setSelectedGeo,
}) => {
  return (e) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev <= 0 ? suggestions.length - 1 : prev - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          const selected = suggestions[activeIndex];

          if (selected?.lat != null && selected?.lon != null) {
            setFieldValue(selected.name);
            setSelectedGeo(selected);
          }

          setActiveIndex(-1);
        }
        break;

      default:
        break;
    }
  };
};
