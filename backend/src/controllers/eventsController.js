const Event = require("../models/eventModel");
const eventsService = require("../services/eventsService");

/**
 * Get events with caching and filtering.
 * When category filtering is active, fetch multiple pages to ensure results.
 */
exports.getEvents = async (req, res) => {
  try {
    let {
      start = "today",
      end,
      keyword,
      text,
      location,
      sort = "date",
      language = "en",
      page = 1,
      page_size = 20,
      categoryText,
    } = req.query;

    page = parseInt(page, 10) || 1;
    page_size = parseInt(page_size, 10) || 20;

    console.log("getEvents called with params:", {
      start,
      end,
      keyword,
      text,
      location,
      sort,
      language,
      page,
      page_size,
      categoryText,
    });

    const hasStrictDateFilter =
      (start && start !== "today") || (end && end.trim() !== "");
    
    // Check if category filtering is active
    const hasCategoryFilter = categoryText && categoryText.trim();

    // Helper: build params we send to LinkedEvents
    const buildBaseApiParams = () => {
      const apiParams = {
        start,
        end,
        language,
      };

      if (keyword && keyword.trim()) {
        apiParams.keyword = keyword.trim();
      }

      if (text && text.trim()) {
        apiParams.text = text.trim();
        console.log("Adding text search:", text.trim());
      }

      if (location && location.trim()) {
        const locationMap = {
          helsinki: "helsinki",
          espoo: "espoo",
          vantaa: "vantaa",
          kauniainen: "kauniainen",
        };
        const divisionName = locationMap[location.toLowerCase().trim()];
        if (divisionName) {
          apiParams.division = divisionName;
        }
      }

      if (sort === "date" || sort === "recent") {
        apiParams.sort = "start_time";
      } else if (sort === "name") {
        apiParams.sort = "name";
      }

      return apiParams;
    };

    // Helper to escape special regex characters
    const escapeRegex = (str) => {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // More accurate category filter
    const applyCategoryFilter = (events, rawCategoryText) => {
      if (!rawCategoryText || !rawCategoryText.trim()) return events;

      const filter = rawCategoryText.trim().toLowerCase();
      console.log(`🔍 Applying category filter: "${filter}"`);

      const filtered = events.filter((ev) => {
        const categories = Array.isArray(ev.categories) ? ev.categories : [];
        const keywords = Array.isArray(ev.keywords) ? ev.keywords : [];

        const matchesCategory = categories.some((c) => {
          const categoryLower = c.toLowerCase();
          
          // EXACT MATCH
          if (categoryLower === filter) return true;
          
          // WORD BOUNDARY MATCH
          const wordBoundaryRegex = new RegExp(`\\b${escapeRegex(filter)}\\b`, 'i');
          if (wordBoundaryRegex.test(categoryLower)) return true;

          // SMART PARTIAL MATCH
          if (filter.length > 4 && categoryLower.includes(filter)) return true;

          return false;
        });

        const matchesKeyword = keywords.some((kw) => {
          const name = (kw.name?.en || kw.name?.fi || kw.name?.sv || "").toLowerCase();
          
          // EXACT MATCH
          if (name === filter) return true;
          
          // WORD BOUNDARY MATCH
          const wordBoundaryRegex = new RegExp(`\\b${escapeRegex(filter)}\\b`, 'i');
          if (wordBoundaryRegex.test(name)) return true;

          // SMART PARTIAL MATCH
          if (filter.length > 4 && name.includes(filter)) return true;

          return false;
        });

        return matchesCategory || matchesKeyword;
      });

      console.log(`🎯 Category filter result: ${filtered.length}/${events.length} events matched`);
      return filtered;
    };

    if (!hasStrictDateFilter) {
      
      // Fetch multiple pages when category filtering
      if (hasCategoryFilter) {
        console.log("📦 Category filter detected - fetching multiple pages...");
        
        const FETCH_PAGE_SIZE = 100;
        const MAX_PAGES = 5; // Fetch up to 500 events total
        let allEvents = [];
        let currentApiPage = 1;
        let hasMore = true;

        const baseParams = buildBaseApiParams();

        // Fetch multiple pages
        while (hasMore && currentApiPage <= MAX_PAGES) {
          const apiParams = {
            ...baseParams,
            page: currentApiPage,
            page_size: FETCH_PAGE_SIZE,
          };

          console.log(`📥 Fetching page ${currentApiPage}/${MAX_PAGES}...`);

          const apiResponse = await linkedEventsService.fetchEvents(apiParams);

          if (
            !apiResponse.success ||
            !apiResponse.data ||
            !Array.isArray(apiResponse.data) ||
            apiResponse.data.length === 0
          ) {
            console.log(`⛔ No more data from API at page ${currentApiPage}`);
            hasMore = false;
            break;
          }

          const transformed = apiResponse.data.map((event) =>
            linkedEventsService.transformEvent(event)
          );

          allEvents = allEvents.concat(transformed);

          console.log(`✅ Fetched ${transformed.length} events (total: ${allEvents.length})`);

          // Stop if no more pages
          if (!apiResponse.meta?.next) {
            hasMore = false;
          } else {
            currentApiPage += 1;
          }
        }

        console.log(`📊 Total events fetched: ${allEvents.length}`);

        // Apply category filter
        let filteredEvents = applyCategoryFilter(allEvents, categoryText);

        console.log(`🎯 After category filter: ${filteredEvents.length} events`);

        // Client-side pagination
        const total = filteredEvents.length;
        const total_pages = Math.ceil(total / page_size);
        const startIndex = (page - 1) * page_size;
        const endIndex = startIndex + page_size;
        const pageEvents = filteredEvents.slice(startIndex, endIndex);

        // Cache in background
        pageEvents.forEach((event) => {
          Event.findOneAndUpdate({ apiId: event.apiId }, event, {
            upsert: true,
            new: true,
          }).catch((err) => console.error("Cache error:", err));
        });

        return res.status(200).json({
          success: true,
          source: "api",
          data: pageEvents,
          pagination: {
            page,
            page_size,
            total,
            total_pages,
          },
        });
      }

      // NO CATEGORY FILTER - Standard pagination
      const apiParams = {
        ...buildBaseApiParams(),
        page,
        page_size,
      };

      console.log("Calling external Events API (simple) with params:", apiParams);

      const apiResponse = await linkedEventsService.fetchEvents(apiParams);

      console.log("External Events API Response (simple):", {
        success: apiResponse.success,
        count: apiResponse.data?.length,
        total: apiResponse.meta?.count,
        hasData: !!apiResponse.data,
        dataIsArray: Array.isArray(apiResponse.data),
      });

      if (
        !apiResponse.success ||
        !apiResponse.data ||
        !Array.isArray(apiResponse.data)
      ) {
        return res.status(200).json({
          success: true,
          source: "api",
          data: [],
          pagination: {
            page,
            page_size,
            total: 0,
            total_pages: 0,
          },
        });
      }

      let eventsToCache = apiResponse.data.map((event) =>
        linkedEventsService.transformEvent(event)
      );

      // Cache in background
      eventsToCache.forEach((event) => {
        Event.findOneAndUpdate({ apiId: event.apiId }, event, {
          upsert: true,
          new: true,
        }).catch((err) => console.error("Cache error:", err));
      });

      return res.status(200).json({
        success: true,
        source: "api",
        data: eventsToCache,
        pagination: {
          page,
          page_size,
          total: apiResponse.meta?.count || 0,
          total_pages: Math.ceil((apiResponse.meta?.count || 0) / page_size),
        },
      });
    }

    console.log("Using STRICT date filtering path");

    const uiStartDate =
      start && start !== "today" ? new Date(start + "T00:00:00") : null;
    const uiEndDate = end ? new Date(end + "T23:59:59") : null;

    console.log("UI dates:", { uiStartDate, uiEndDate });

    const baseApiParams = buildBaseApiParams();

    const EXTERNAL_PAGE_SIZE = 100;
    const MAX_PAGES = 5;

    let currentApiPage = 1;
    let allTransformed = [];
    let hasMore = true;

    while (hasMore && currentApiPage <= MAX_PAGES) {
      const apiParams = {
        ...baseApiParams,
        page: currentApiPage,
        page_size: EXTERNAL_PAGE_SIZE,
      };

      console.log(
        `Calling external Events API (strict dates) page ${currentApiPage} with params:`,
        apiParams
      );

      const apiResponse = await linkedEventsService.fetchEvents(apiParams);

      if (
        !apiResponse.success ||
        !apiResponse.data ||
        !Array.isArray(apiResponse.data) ||
        apiResponse.data.length === 0
      ) {
        console.log(
          "Stopping strict-date fetching – no data or error from external API."
        );
        hasMore = false;
        break;
      }

      const batch = apiResponse.data.map((event) =>
        linkedEventsService.transformEvent(event)
      );

      allTransformed = allTransformed.concat(batch);

      console.log(
        `Fetched batch ${currentApiPage}: ${batch.length} events (total so far: ${allTransformed.length})`
      );

      if (!apiResponse.meta?.next) {
        hasMore = false;
      } else {
        currentApiPage += 1;
      }
    }

    console.log(
      `Total transformed events BEFORE filters: ${allTransformed.length}`
    );

    // Apply category filter
    let strictlyFiltered = applyCategoryFilter(allTransformed, categoryText);

    // Strict date filtering
    if (uiStartDate instanceof Date && !isNaN(uiStartDate)) {
      strictlyFiltered = strictlyFiltered.filter(
        (ev) => ev.startTime && ev.startTime >= uiStartDate
      );
    }

    if (uiEndDate instanceof Date && !isNaN(uiEndDate)) {
      strictlyFiltered = strictlyFiltered.filter((ev) => {
        if (ev.endTime) return ev.endTime <= uiEndDate;
        return ev.startTime && ev.startTime <= uiEndDate;
      });
    }

    console.log(
      `Events AFTER strict date + category filter: ${strictlyFiltered.length}`
    );

    // Sort by start date
    strictlyFiltered.sort((a, b) => {
      const aTime = a.startTime ? a.startTime.getTime() : 0;
      const bTime = b.startTime ? b.startTime.getTime() : 0;
      return aTime - bTime;
    });

    const total = strictlyFiltered.length;
    const total_pages = total === 0 ? 0 : Math.ceil(total / page_size);
    const startIndex = (page - 1) * page_size;
    const endIndex = startIndex + page_size;
    const pageEvents = strictlyFiltered.slice(startIndex, endIndex);

    // Cache what we actually send
    pageEvents.forEach((event) => {
      Event.findOneAndUpdate({ apiId: event.apiId }, event, {
        upsert: true,
        new: true,
      }).catch((err) => console.error("Cache error:", err));
    });

    return res.status(200).json({
      success: true,
      source: "api+strict-filter",
      data: pageEvents,
      pagination: {
        page,
        page_size,
        total,
        total_pages,
      },
    });
  } catch (error) {
    console.error("Error in getEvents:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

/**
 * Get single event by ID
 */
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = "en" } = req.query;

    let event = await Event.findOne({ apiId: id });

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (event && event.lastFetchedAt >= oneDayAgo) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: event,
      });
    }

    // Fetch from API
    const apiResponse = await eventsService.fetchEventById(id, language);

    if (!apiResponse.success) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Transform and cache
    const transformedEvent = eventsService.transformEvent(
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
 * Force refresh events from API
 */
exports.refreshEvents = async (req, res) => {
  try {
    const {
      start = "today",
      end,
      language = "en",
      page_size = 100,
    } = req.query;

    const apiResponse = await eventsService.fetchEvents({
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
      eventsService.transformEvent(event)
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
 */
exports.getCategories = async (req, res) => {
  try {
    console.log('Fetching unique categories from API...');

    const apiParams = {
      page: 1,
      page_size: 100,
      language: 'en',
      start: 'today',
      include: 'keywords'
    };

    const apiResponse = await linkedEventsService.fetchEvents(apiParams);

    if (!apiResponse.success || !apiResponse.data) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch events for categories'
      });
    }

    const categoriesSet = new Set();

    apiResponse.data.forEach(event => {
      if (event.keywords && Array.isArray(event.keywords)) {
        event.keywords.forEach(keyword => {
          const name = keyword.name?.en || keyword.name?.fi || keyword.name?.sv;
          if (name && name.trim()) {
            categoriesSet.add(name.trim());
          }
        });
      }

      const transformedEvent = linkedEventsService.transformEvent(event);
      if (transformedEvent.categories && Array.isArray(transformedEvent.categories)) {
        transformedEvent.categories.forEach(cat => {
          if (cat && cat.trim()) {
            categoriesSet.add(cat.trim());
          }
        });
      }
    });

    const categories = Array.from(categoriesSet).sort();

    console.log(`Found ${categories.length} unique categories`);

    res.status(200).json({
      success: true,
      data: {
        categories,
        total: categories.length
      }
    });

  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};