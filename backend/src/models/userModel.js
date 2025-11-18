// backend/models/userModel.js

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
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    favorites: [
      {
        eventId: { type: String, required: true }, // Linked Events API event ID
        title: String,
        date: String,
        image: String,
        category: String, // for preference learning
      },
    ],

    preferences: [
      {
        type: String, // e.g., "music", "sports", "theatre", "family", etc.
      },
    ],

    subscriptions: [
      {
        type: {
          type: String,
          enum: ["category", "venue", "event"],
          required: true,
        },
        targetId: {
          type: String,
          required: true,
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
