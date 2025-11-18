const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventsSchema = new Schema(
  {
    city: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
  },
);

module.exports = mongoose.model("Event", eventsSchema);

