const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    apiId: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    comment: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 500
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
