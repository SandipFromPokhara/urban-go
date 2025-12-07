import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  // Fetch favorites
  useEffect(() => {
    (async () => {
      if (!token) return setLoading(false);
      try {
        const res = await axios.get("http://localhost:5001/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data.favorites || []);
      } catch (err) {
        console.error("Could not fetch favorites:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const add = async (eventId) => {
    if (!token) return console.error("User not authenticated");
    try {
      const res = await axios.post(
        `http://localhost:5001/api/favorites/${eventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(res.data.favorites);
    } catch (err) {
      console.error("Failed to add favorite:", err);
    }
  };

  const remove = async (eventId) => {
    if (!token) return console.error("User not authenticated");
    try {
      const res = await axios.delete(`http://localhost:5001/api/favorites/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data.favorites);
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  const isFavorited = (eventId) => favorites.some((f) => f.eventId === eventId);

  return (
    <FavoritesContext.Provider value={{ favorites, loading, add, remove, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
