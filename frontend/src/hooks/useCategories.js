// frontend/src/hooks/useCategories.js
// Custom hook to fetch dynamic categories from API

import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch available event categories
 * @returns {Object} { categories, loading, error }
 */
export const useCategories = () => {
  const [categories, setCategories] = useState(['All Events']); // Default option
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:5001/api/events/meta/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const result = await response.json();

        if (result.success && result.data?.categories) {
          // Add "All Events" as first option, then the fetched categories
          setCategories(['All Events', ...result.data.categories]);
        }

      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
        
        // Fallback to default categories if fetch fails
        setCategories([
          'All Events',
          'Music',
          'Arts & Culture',
          'Sports',
          'Food & Drink',
          'Museums'
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export default useCategories;