const API_URL = "http://localhost:5003/api";

export const getToken = () => localStorage.getItem("token");

export const getFavorites = async () => {
  const res = await fetch(`${API_URL}/favorites`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to load favorites");
  const data = await res.json();
  return data.favorites; // returns array
};

export const addFavorite = async (event) => {
  const res = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(event),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to add favorite");
  }
  console.log("Added to favorites");
  return res.json();
};

export const removeFavorite = async (eventId) => {
  const res = await fetch(`${API_URL}/favorites/${eventId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to remove favorite");
  }
  console.log("Removed from favorites");
  return res.json();
};
