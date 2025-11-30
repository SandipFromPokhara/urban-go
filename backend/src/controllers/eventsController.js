const Event = require("../models/eventModel");
const linkedEventsService = require("../services/linkedEventsService");

/**
 * Get events with caching and filtering
 * Always fetches from API to ensure accurate pagination
 */
exports.getEvents = async (req, res) => {
  try {
    const {
      start = "today",
      end,
      keyword,
      text,
      location,
      sort = "date",
      language = "en",
      page = 1,
      page_size = 20,
    } = req.query;

    console.log('getEvents called with params:', { start, end, keyword, text, location, sort, language, page, page_size });

    // Fetch from LinkedEvents API for accurate total count and pagination
    const apiParams = {
      start,
      end,
      language,
      page,
      page_size,
    };

    // Add keyword filter (can be single or comma-separated list)
    if (keyword && keyword.trim()) {
      apiParams.keyword = keyword.trim();
    }

    // Add text search (user's search input)
    // IMPORTANT: Only add if not empty to avoid API errors
    if (text && text.trim()) {
      apiParams.text = text.trim();
      console.log('Adding text search:', text.trim());
    }

    // Add location filter (division parameter for LinkedEvents)
    // Maps city names to their division identifiers
    if (location && location.trim()) {
      const locationMap = {
        'helsinki': 'helsinki',
        'espoo': 'espoo',
        'vantaa': 'vantaa',
        'kauniainen': 'kauniainen'
      };
      
      const divisionName = locationMap[location.toLowerCase().trim()];
      if (divisionName) {
        apiParams.division = divisionName;
      }
    }

    // Add sort parameter to LinkedEvents API
    // LinkedEvents supports: start_time, end_time, name, duration, etc.
    if (sort === 'date' || sort === 'recent') {
      apiParams.sort = 'start_time'; // Sort by event start time
    } else if (sort === 'name') {
      apiParams.sort = 'name'; // Sort alphabetically
    }

    console.log('Calling LinkedEvents API with params:', apiParams);

    const apiResponse = await linkedEventsService.fetchEvents(apiParams);

    console.log('LinkedEvents API Response:', {
      success: apiResponse.success,
      count: apiResponse.data?.length,
      total: apiResponse.meta?.count,
      hasData: !!apiResponse.data,
      dataIsArray: Array.isArray(apiResponse.data)
    });

    if (!apiResponse.success) {
      console.error('LinkedEvents API returned success: false');
      return res.status(200).json({
        success: true,
        source: "api",
        data: [],
        pagination: {
          page: parseInt(page),
          page_size: parseInt(page_size),
          total: 0,
          total_pages: 0,
        },
      });
    }

    if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
      console.error('LinkedEvents API returned invalid data format');
      return res.status(200).json({
        success: true,
        source: "api",
        data: [],
        pagination: {
          page: parseInt(page),
          page_size: parseInt(page_size),
          total: 0,
          total_pages: 0,
        },
      });
    }

    if (apiResponse.data.length === 0) {
      console.log('LinkedEvents API returned 0 events');
      return res.status(200).json({
        success: true,
        source: "api",
        data: [],
        pagination: {
          page: parseInt(page),
          page_size: parseInt(page_size),
          total: 0,
          total_pages: 0,
        },
      });
    }

    // Cache the fetched events in background
    const eventsToCache = apiResponse.data.map((event) =>
      linkedEventsService.transformEvent(event)
    );

    console.log(`Transformed ${eventsToCache.length} events for response`);

    // Upsert events
    eventsToCache.forEach((event) => {
      Event.findOneAndUpdate(
        { apiId: event.apiId },
        event,
        { upsert: true, new: true }
      ).catch(err => console.error('Cache error:', err));
    });

    // Return transformed events with accurate pagination from API
    res.status(200).json({
      success: true,
      source: "api",
      data: eventsToCache,
      pagination: {
        page: parseInt(page),
        page_size: parseInt(page_size),
        total: apiResponse.meta?.count || 0,
        total_pages: Math.ceil((apiResponse.meta?.count || 0) / parseInt(page_size)),
      },
    });
  } catch (error) {
    console.error("Error in getEvents:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

/**
 * Get single event by ID
 * Checks cache first, fetches from API if needed
 */
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = "en" } = req.query;

    // Check cache first
    let event = await Event.findOne({ apiId: id });

    // If cached and recent (within 24 hours), return it
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (event && event.lastFetchedAt >= oneDayAgo) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: event,
      });
    }

    // Fetch from API
    const apiResponse = await linkedEventsService.fetchEventById(id, language);

    if (!apiResponse.success) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Transform and cache
    const transformedEvent = linkedEventsService.transformEvent(
      apiResponse.data
    );

    event = await Event.findOneAndUpdate(
      { apiId: transformedEvent.apiId },
      transformedEvent,
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      source: "api",
      data: event,
    });
  } catch (error) {
    console.error("Error in getEventById:", error);
    
    if (error.message === "Event not found") {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};

/**
 * Force refresh events from API (admin only)
 * Useful for updating cache manually
 */
exports.refreshEvents = async (req, res) => {
  try {
    const {
      start = "today",
      end,
      language = "en",
      page_size = 100,
    } = req.query;

    const apiResponse = await linkedEventsService.fetchEvents({
      start,
      end,
      language,
      page_size,
    });

    if (!apiResponse.success || !apiResponse.data.length) {
      return res.status(200).json({
        success: true,
        message: "No events to refresh",
        count: 0,
      });
    }

    const eventsToCache = apiResponse.data.map((event) =>
      linkedEventsService.transformEvent(event)
    );

    const cachePromises = eventsToCache.map((event) =>
      Event.findOneAndUpdate(
        { apiId: event.apiId },
        event,
        { upsert: true, new: true }
      )
    );

    await Promise.all(cachePromises);

    res.status(200).json({
      success: true,
      message: "Events cache refreshed successfully",
      count: eventsToCache.length,
    });
  } catch (error) {
    console.error("Error in refreshEvents:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refresh events",
      error: error.message,
    });
  }
};

/**
 * Get event categories/keywords
 * Returns unique categories from cached events
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Event.distinct("categories");
    
    res.status(200).json({
      success: true,
      data: categories.filter(Boolean).sort(),
    });
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};