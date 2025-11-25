const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * User Registration Controller
 * Handles user signup for new accounts.
 *
 * - Validates required input fields for registration (username, email, password, dateOfBirth).
 * - Checks if the email is already registered (unique user check).
 * - Hashes user password securely before saving.
 * - Creates and stores the new user document in MongoDB.
 * - Responds with confirmation (never sends password/hash back).
 *
 * @route POST /auth/register
 * @public
 */

const register = async (req, res) => {
  const { username, email, password, dateOfBirth, address } =
    req.body;

  // Validate registration input: All required fields must be provided.
  if (!username || !email || !password || !dateOfBirth || !address) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Ensure email is unique, prevent duplicate accounts.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }
    // Securely hash password before storing in the database.
    const hashed = await bcrypt.hash(req.body.password, 12);

    // Create and store new user document in MongoDB collection.
    const user = await User.create({
      username,
      email,
      password: hashed,
      dateOfBirth,
      address,
      role: "user",
    });
    // Safe response: never include password or hash.
    res.status(201).json({
      message: "User registered successfully!",
      userId: user._id,
      email: user.email,
      username: user.username,
      role: user.role, 
    });
  } catch (error) {
    // Handle and report any server or validation errors
    res.status(500).json({ message: "Failed to register user", error: error.message 
  });
  }
};

/**
 * User Login Controller
 * Handles authentication of existing users.
 *
 * Steps:
 * - Validates presence of email and password in login request.
 * - Looks up user in database by email.
 * - Compares login password with stored hashed password.
 * - If valid, issues a JWT (JSON Web Token) for session/auth use.
 * - Responds with token and safe user info.
 *
 * @route POST /auth/login
 * @public
 */
const login = async (req, res) => {
  // Find user record by email
  const { email, password } = req.body;

  // Validate login input: Email and password must exist.
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Find user record by email.
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check password: Compare provided password with stored hash.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    // Prepare the JWT payload (userId, email, role)
    const payload = { userId: user._id, email: user.email, role: user.role };
    // Generate JWT with user info and session time limit.
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

    // Safe response: Send token and public user data.
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Export controller functions for router use.
module.exports = { register, login };
