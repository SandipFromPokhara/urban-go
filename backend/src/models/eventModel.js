const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    // LinkedEvents API ID (unique identifier from external API)
    apiId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      en: String,
      fi: String,
      sv: String,
    },

    description: {
      en: String,
      fi: String,
      sv: String,
    },

    shortDescription: {
      en: String,
      fi: String,
      sv: String,
    },

    images: [
      {
        url: String,
        name: String,
      },
    ],

    startTime: {
      type: Date,
      index: true,
    },

    endTime: {
      type: Date,
      index: true,
    },

    location: {
      name: {
        en: String,
        fi: String,
        sv: String,
      },
      streetAddress: {
        en: String,
        fi: String,
        sv: String,
      },
      city: {
        en: String,
        fi: String,
        sv: String,
      },
      postalCode: String,
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
        },
      },
    },

    keywords: [
      {
        id: String,
        name: {
          en: String,
          fi: String,
          sv: String,
        },
      },
    ],

    categories: [String], // Extracted from keywords for easier filtering

    offers: [
      {
        isFree: Boolean,
        price: {
          en: String,
          fi: String,
          sv: String,
        },
        infoUrl: {
          en: String,
          fi: String,
          sv: String,
        },
      },
    ],

    infoUrl: {
      en: String,
      fi: String,
      sv: String,
    },

    provider: {
      en: String,
      fi: String,
      sv: String,
    },

    publisher: String,

    // Metadata for caching
    lastFetchedAt: {
      type: Date,
      default: Date.now,
    },

    isCached: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for geospatial queries (optional, for future location-based features)
eventSchema.index({ "location.coordinates": "2dsphere" });

// Index for date-based queries
eventSchema.index({ startTime: 1, endTime: 1 });

// Index for category filtering
eventSchema.index({ categories: 1 });

module.exports = model("Event", eventSchema);