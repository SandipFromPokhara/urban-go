const axios = require("axios");

const EVENTS_BASE_URL = process.env.EVENTS_URL;

// Simple in-memory cache with 5-minute expiry
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class EventsService {
  /**
   * Fetch events from Events API
   * @param {Object} params - Query parameters
   * @param {string} params.start - Start date (ISO format or 'today')
   * @param {string} params.end - End date (ISO format or 'next_week')
   * @param {string} params.language - Language code (en, fi, sv)
   * @param {string} params.keyword - Keyword/category filter
   * @param {string} params.text - Text search query
   * @param {string} params.location - Location ID
   * @param {string} params.division - Division/city filter
   * @param {string} params.sort - Sort order
   * @param {number} params.page - Page number for pagination
   * @param {number} params.page_size - Number of results per page
   * @returns {Promise<Object>} Events data with metadata
   */
  async fetchEvents(params = {}) {
    try {
      const queryParams = {
        start: params.start || "today",
        language: params.language || "en",
        include: "keywords,location",
        sort: params.sort || "start_time",
        page_size: params.page_size || 50,
        page: params.page || 1,
      };

      // Generate cache key from query params
      const cacheKey = JSON.stringify(queryParams);
      const cachedData = cache.get(cacheKey);
      
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        console.log('Returning cached events data');
        return cachedData.data;
      }

      // Add optional filters (only if they have values)
      if (params.end) {
        queryParams.end = params.end;
      }

      if (params.keyword) {
        queryParams.keyword = params.keyword;
      }

      if (params.location) {
        queryParams.location = params.location;
      }

      if (params.division) {
        queryParams.division = params.division;
      }

      // IMPORTANT: Only add text if it's not empty
      if (params.text && params.text.trim()) {
        queryParams.text = params.text.trim();
      }

      console.log('External Events API request:', {
        params: queryParams
      });

      const response = await axios.get(`${EVENTS_BASE_URL}/event/`, {
        params: queryParams,
        timeout: 10000, // 10 second timeout
      });

      console.log('External Events API response:', {
        status: response.status,
        dataCount: response.data.data?.length,
        totalCount: response.data.meta?.count
      });

      const result = {
        success: true,
        data: response.data.data || [],
        meta: {
          count: response.data.meta?.count || 0,
          next: response.data.meta?.next || null,
          previous: response.data.meta?.previous || null,
        },
      };

      // Cache the result
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      // Clean up old cache entries (keep cache size reasonable)
      if (cache.size > 50) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      return result;
    } catch (error) {
      console.error("External Events API Error:", error.message);
      
      if (error.response) {
        // API responded with error status
        console.error('API Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        
        // Return failed response instead of throwing
        return {
          success: false,
          data: [],
          meta: {
            count: 0,
            next: null,
            previous: null,
          },
          error: `External Events API error: ${error.response.status} - ${error.response.statusText}`
        };
      } else if (error.request) {
        // Request made but no response
        console.error('No response from External Events API');
        return {
          success: false,
          data: [],
          meta: {
            count: 0,
            next: null,
            previous: null,
          },
          error: "External Events API is not responding"
        };
      } else {
        // Something else happened
        console.error('Error setting up request:', error.message);
        return {
          success: false,
          data: [],
          meta: {
            count: 0,
            next: null,
            previous: null,
          },
          error: `Error setting up Events API request: ${error.message}`
        };
      }
    }
  }

  /**
   * Fetch a single event by ID
   * @param {string} eventId - Event ID from external Events API
   * @param {string} language - Language code (en, fi, sv)
   * @returns {Promise<Object>} Single event data
   */
  async fetchEventById(eventId, language = "en") {
    try {
      const response = await axios.get(
        `${EVENTS_BASE_URL}/event/${eventId}/`,
        {
          params: {
            language,
            include: "keywords,location",
          },
          timeout: 10000,
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(`Error fetching event ${eventId}:`, error.message);
      
      if (error.response?.status === 404) {
        throw new Error("Event not found");
      }
      
      throw new Error(`Failed to fetch event: ${error.message}`);
    }
  }

  /**
   * Transform external Events API data to our schema format
   * @param {Object} apiEvent - Event data from external Events API
   * @returns {Object} Transformed event object
   */
  transformEvent(apiEvent) {
    // Extract categories from keywords
    const categories = apiEvent.keywords?.map((kw) => 
      kw.name?.en || kw.name?.fi || kw.name?.sv || ""
    ).filter(Boolean) || [];

    return {
      apiId: apiEvent.id,
      name: apiEvent.name || {},
      description: apiEvent.description || {},
      shortDescription: apiEvent.short_description || {},
      images: apiEvent.images?.map((img) => ({
        url: img.url,
        name: img.name,
      })) || [],
      startTime: apiEvent.start_time ? new Date(apiEvent.start_time) : null,
      endTime: apiEvent.end_time ? new Date(apiEvent.end_time) : null,
      location: {
        name: apiEvent.location?.name || {},
        streetAddress: apiEvent.location?.street_address || {},
        city: apiEvent.location?.address_locality || {},
        postalCode: apiEvent.location?.postal_code || "",
        coordinates: apiEvent.location?.position?.coordinates
          ? {
              type: "Point",
              coordinates: [
                apiEvent.location.position.coordinates[0], // longitude
                apiEvent.location.position.coordinates[1], // latitude
              ],
            }
          : undefined,
      },
      keywords: apiEvent.keywords?.map((kw) => ({
        id: kw.id,
        name: kw.name || {},
      })) || [],
      categories,
      offers: apiEvent.offers?.map((offer) => ({
        isFree: offer.is_free || false,
        price: offer.price || {},
        infoUrl: offer.info_url || {},
      })) || [],
      infoUrl: apiEvent.info_url || {},
      provider: apiEvent.provider || {},
      publisher: apiEvent.publisher || "",
      lastFetchedAt: new Date(),
      isCached: true,
    };
  }
}

module.exports = new EventsService();