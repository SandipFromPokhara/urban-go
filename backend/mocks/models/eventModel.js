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
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,  
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    tags: {
      type: String,  
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventsSchema);