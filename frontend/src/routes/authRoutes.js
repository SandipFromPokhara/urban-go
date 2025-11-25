const express = require("express");
const router = express.Router();
const {register, login } = require("../controllers/authController");
// Registration and login for all users (admin and regular)
router.post("/register", register);
router.post("/login", login);

module.exports = router;