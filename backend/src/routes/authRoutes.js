const express = require("express");
const router = express.Router();
const {register, login } = require("../controllers/authController");
const { validateSignup, validateLogin } = require("../middleware/validateUser");

// Registration and login for all users (admin and regular)
router.post("/register", validateSignup, register);
router.post("/login", validateLogin, login);

module.exports = router;