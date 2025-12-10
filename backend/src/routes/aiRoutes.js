// backend/src/routes/aiRoutes.js

const express = require("express");
const router = express.Router();
const generateText = require("../controllers/aiController");

router.post("/query", generateText);

module.exports = router;