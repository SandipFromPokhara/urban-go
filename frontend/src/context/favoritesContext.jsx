import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  // Fetch favorites
  useEffect(() => {
    if (!token) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await axios.get("/api/favorites", {
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
        `/api/favorites/${eventId}`,
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
      const res = await axios.delete(
        `/api/favorites/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFavorites(res.data.favorites);
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  const isFavorited = (eventId) => favorites.some((f) => f.eventId === eventId);

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, add, remove, isFavorited, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
