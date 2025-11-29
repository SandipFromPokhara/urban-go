import { createContext, useContext, useEffect, useState } from "react";
import { getFavorites, addFavorite, removeFavorite } from "../hooks/favorites";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites when app starts
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getFavorites(); // returns array from the database
        setFavorites(data);
      } catch (err) {
        console.error("Failed to load favorites:", err);
      }
    };
    load();
  }, []);

  const isFavorite = (eventId) => {
  return favorites.some((f) => (f.eventId || f.id) === eventId);
};

  const toggleFavorite = async (event) => {
  try {
    const eventId = event.id || event.eventId;

    if (isFavorite(eventId)) {
      await removeFavorite(eventId);
      setFavorites((prev) => prev.filter((f) => (f.eventId || f.id) !== eventId));
    } else {
      const normalizedEvent = { ...event, eventId }; // ensure eventId field exists

      await addFavorite(normalizedEvent);

      setFavorites((prev) => [...prev, normalizedEvent]);
    }
  } catch (err) {
    console.error("Failed to toggle favorite:", err);
    alert(err.message || "Failed to toggle favorite");
  }
};

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
