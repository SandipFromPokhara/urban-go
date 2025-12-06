import React from "react";
import EventCard from "./EventCard";
import { useFavorites } from "../../context/favoritesContext";
import { AnimatePresence, motion } from "framer-motion";

const FavoritesList = ({ isDarkMode }) => {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className={isDarkMode ? "text-white" : "text-gray-700"}>
          Loading favorites...
        </p>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <p className={isDarkMode ? "text-white" : "text-gray-700"}>
          You have no favorite events yet.
        </p>
      </div>
    );
  }

  const cleanHtml = (html) => {
    return html?.replace(/<[^>]+>/g, "").trim() || "";
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <AnimatePresence>
        {favorites.map((fav) => (
          <motion.div
            key={fav.eventId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
          >
            <EventCard
              event={{
                id: fav.eventId,
                name: fav.title,
                description: cleanHtml(fav.description),
                date: formatDate(fav.date),
                image: fav.image,
                category: fav.category,
                location: fav.location || "TBA",
              }}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FavoritesList;
