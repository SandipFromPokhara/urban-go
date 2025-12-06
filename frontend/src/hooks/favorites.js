const API_URL = "http://localhost:5001/api";

export const getToken = () => localStorage.getItem("token");

export const getFavorites = async () => {
  try {
    const res = await fetch(`${API_URL}/favorites`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to load favorites");
    }

    const data = await res.json();
    return data.favorites || [];
  } catch (err) {
    console.error("Error fetching favorites:", err.message);
    return []; // return empty array on failure
  }
};

export const addFavorite = async (event) => {
  try {
    const res = await fetch(`${API_URL}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to add favorite");
    }

    console.log("Added to favorites");
    return await res.json();
  } catch (err) {
    console.error("Error adding favorite:", err.message);
    return null; // return null on failure
  }
};

export const removeFavorite = async (eventId) => {
  try {
    const res = await fetch(`${API_URL}/favorites/${eventId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to remove favorite");
    }

    console.log("Removed from favorites");
    return await res.json();
  } catch (err) {
    console.error("Error removing favorite:", err.message);
    return null; // return null on failure
  }
};
