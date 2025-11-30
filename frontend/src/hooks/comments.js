const API_URL = "http://localhost:5001/api/comments";

// Get all comments for an event
export const getComments = async (eventId) => {
  const res = await fetch(`${API_URL}/${eventId}`);
  return res.json();
};

// Add new comment
export const addComment = async (eventId, comment) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ eventId, comment }),
  });

  return res.json();
};

// Delete a comment
export const deleteComment = async (commentId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
