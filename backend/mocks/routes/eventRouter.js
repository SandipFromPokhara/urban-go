const express = require("express");
const router = express.Router();
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require("../controllers/eventControllers");

// GET /events
router.get("/", getAllEvents);

// POST /events
router.post("/", createEvent);

// GET /events/:eventId
router.get("/:eventId", getEventById);

// PUT /events/:eventId
router.put("/:eventId", updateEvent);

// DELETE /events/:eventId
router.delete("/:eventId", deleteEvent);

module.exports = router;
