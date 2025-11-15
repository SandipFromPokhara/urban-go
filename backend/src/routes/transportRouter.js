const express = require("express");
const router = express.Router();
const {
  getAllTransports,
  getTransportById,
  createTransport,
  updateTransport,
  deleteTransport,
} = require("../controllers/transportControllers");

// GET /transports
router.get("/", getAllTransports);

// POST /transports
router.post("/", createTransport);

// GET /transports/:transportId
router.get("/:transportId", getTransportById);

// PUT /transports/:transportId
router.put("/:transportId", updateTransport);

// DELETE /transports/:transportId
router.delete("/:transportId", deleteTransport);

module.exports = router;
