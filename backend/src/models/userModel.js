// backend/src/models/userModel.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },

    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
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
        apiId: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

// static signup method
userSchema.statics.signup = async function ( firstName, lastName, email, password, dateOfBirth, address ) {

  const userExists = await this.findOne({ email });
  if (userExists) throw Error("User already exists")

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    dateOfBirth,
    address,
  });

  return user;
};

userSchema.statics.login = async function(email, password) {

  const user = await this.findOne({ email });
  if (!user) throw Error("Incorrect email");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Error("Incorrect password");

  return user;
};

module.exports = mongoose.model("User", userSchema);
