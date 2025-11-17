// backend/src/models/userModel.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    address: {
      street: { type: String, require: true },
      postalCode: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, default: "Finland" },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    favorites: [
      {
        eventId: { type: String, required: true }, // Event ID from API
        title: String,
        date: String,
        image: String,
        category: String, // for preference
      },
    ],

    preferences: [
      {
        type: String, // e.g., "music", "sports", "theatre", "family"
      },
    ],

    subscriptions: [
      {
        type: {
          type: String,
          enum: ["category", "venue", "event"], // category ID / venue ID / event ID
          required: true,
        },
        targetId: {
          type: String,
          require: true,
        },
      },
    ],

    reviews: [
      {
        eventId: { type: String, required: true },
        comment: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },

    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);