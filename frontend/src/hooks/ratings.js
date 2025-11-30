const BASE_URL = 'http://localhost:5001/api/ratings';

export const getEventRatings = async (eventId, token) => {
  try {
    const res = await fetch(`${BASE_URL}/event/${eventId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) throw new Error('Failed to fetch ratings');

    const data = await res.json();
    return {
      averageRating: data.averageRating ?? null,
      userRating: data.userRating ?? null,
    };
  } catch (err) {
    console.error('getEventRatings error:', err);
    return { averageRating: null, userRating: null };
  }
};

export const postRating = async (eventId, rating, token) => {
  try {
    const res = await fetch(`${BASE_URL}/event/${eventId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ rating }),
    });

    if (!res.ok) throw new Error('Failed to post rating');

    const data = await res.json();
    return { averageRating: data.averageRating ?? null };
  } catch (err) {
    console.error('postRating error:', err);
    return { averageRating: null };
  }
};
