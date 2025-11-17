const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    favouriteEvents: {
      type: [Schema.Types.ObjectId],
      ref: "Event",
      required: false,
    },
    preferences: {
      categories: {
        type: [String],
        required: false,
      },
      tags: {
        type: [String],
        required: false,
      },
      cities: {
        type: [String],
        required: false,
      },
    },
  },
);

module.exports = mongoose.model("User", userSchema);
