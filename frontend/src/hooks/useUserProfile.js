import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      setProfile(null);
      return;
    }

    let cancelled = false;

    try {
      const res = await axios.get("/api/users/me", {
        headers: getAuthHeaders(),
      });
      if (cancelled) return;

      const u = res.data.user || res.data;
      setProfile(u);
    } catch (err) {
      if (cancelled) return;
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      if (!cancelled) setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await fetchProfile();
      } catch {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchProfile]);

  const updateProfile = useCallback(
    async (payload) => {
      const res = await axios.put("/api/users/me", payload, {
        headers: getAuthHeaders(),
      });
      const u = res.data.user || res.data;
      setProfile(u);
      return u;
    },
    [] // relies only on localStorage, not React state
  );

  const deleteProfile = useCallback(async () => {
    await axios.delete("/api/users/me", {
      headers: getAuthHeaders(),
    });
    setProfile(null);
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    deleteProfile,
    refetch: fetchProfile,
  };
}
