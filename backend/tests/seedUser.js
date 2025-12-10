const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../src/models/userModel");

// Use the production DB
const MONGO_URI = process.env.MONGO_URI_PROD;

const run = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB:", MONGO_URI);

    // Check if user already exists
    const userExists = await User.findOne({ email: "admin@urbango.com" });
    if (userExists) {
      console.log("User already exists!");
      process.exit(0);
    }

    // Create normal test user
    const user = await User.signup(
      "Super",
      "Admin",
      "admin@urbango.com",
      "User12345!",        
      new Date("1995-06-15"), 
      {
        street: "456 Demo St",
        city: "SampleCity",
        postalCode: "67890",
      }
    );

    console.log("✅ Super admin created:", user.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
};

run();
