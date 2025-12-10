const BASE_URL = '/api/ratings';

export const getEventRatings = async (apiId, token) => {
  try {
    const res = await fetch(`${BASE_URL}/events/${apiId}/average`, {
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

export const postRating = async (apiId, rating, token) => {
  try {
    const res = await fetch(`${BASE_URL}/events/${apiId}/rate`, {
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
