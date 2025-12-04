import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FavoriteCard from "./FavoritesCard";
import { useFavorites } from "../../context/FavoritesContext";

const Favorites = ({ isDarkMode }) => {
  const { favorites } = useFavorites();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!favorites || favorites.length === 0)
    return <p className="text-white">No favorites yet.</p>;

  return (
    <section className="relative px-8 py-10">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: isDarkMode ? "white" : "black" }}
      >
        Your Favorites
      </h2>

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black shadow-md rounded-full p-2 hover:bg-gray-100 z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black shadow-md rounded-full p-2 hover:bg-gray-100 z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto overflow-y-visible scrollbar-hide"
        style={{ paddingBottom: "1rem" }}
      >
        {favorites.map((event) => (
          <motion.div
            key={event.eventId || event.id}
            whileHover={{ scale: 1, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="shrink-0"
          >
            <FavoriteCard event={event} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Favorites;
