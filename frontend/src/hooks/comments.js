const API_URL = "/api/comments";

// Get all comments for an event
export const getComments = async (apiId) => {
  const res = await fetch(`${API_URL}/${apiId}`);
  return res.json();
};

// Add new comment
export const addComment = async (apiId, comment) => {
  const token = localStorage.getItem("authToken");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ apiId, comment }),
  });

  return res.json();
};

// Delete a comment
export const deleteComment = async (commentId) => {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${API_URL}/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

// Report a comment
export const reportComment = async (commentId) => {
  const res = await fetch(`${API_URL}/${commentId}/report`, {
      method: "POST",
    });

  return res.json();
};