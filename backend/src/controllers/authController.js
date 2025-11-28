const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, password, dateOfBirth, address } = req.body;

  if (!username || !email || !password || !dateOfBirth || !address) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use." });

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashed,
      dateOfBirth,
      address,
      role: "user",
    });

    res.status(201).json({
      message: "User registered successfully!",
      userId: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password." });

    const payload = { userId: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { userId: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

module.exports = { register, login };
