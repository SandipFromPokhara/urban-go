// Admin API service functions

const API_URL = "/api/admin";

// Get JWT token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Get admin dashboard statistics
export const getAdminStats = async () => {
  const response = await fetch(`${API_URL}/stats`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch admin stats");
  }

  return response.json();
};

// Get all users
export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch users");
  }

  return response.json();
};

// Get user details by ID
export const getUserDetails = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user details");
  }

  return response.json();
};

// Get all reviews
export const getAllReviews = async () => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch reviews");
  }

  return response.json();
};

// Delete a review
export const deleteReview = async (reviewId) => {
  const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete review");
  }

  return response.json();
};

// Update user role
export const updateUserRole = async (userId, role) => {
  const response = await fetch(`${API_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: getAuthHeader(),
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update user role");
  }

  return response.json();
};

// Delete a user
export const deleteUser = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete user");
  }

  return response.json();
};
