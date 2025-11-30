import { createContext, useContext, useEffect, useState } from "react";
import { getFavorites, addFavorite, removeFavorite } from "../hooks/favorites";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const getToken = () => localStorage.getItem("token");

  // Load favorites only if logged in
  useEffect(() => {
    const load = async () => {
      if (!getToken()) return;
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (err) {
        console.error("Failed to load favorites:", err);
      }
    };
    load();
  }, []);

  const isFavorite = (eventId) => {
    if (!getToken()) return false;
    return favorites.some((f) => (f.eventId || f.id) === eventId);
  };

  const toggleFavorite = async (event) => {
    if (!getToken()) {
      alert("You must be logged in to save favorites");
      return;
    }

    try {
      const eventId = event.id || event.eventId;

      if (isFavorite(eventId)) {
        await removeFavorite(eventId);
        setFavorites((prev) =>
          prev.filter((f) => (f.eventId || f.id) !== eventId)
        );
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
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
