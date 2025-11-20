const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transportOptionsSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    lines: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransportOptions", transportOptionsSchema);
