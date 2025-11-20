const mongoose = require("mongoose"); 
const Event = require("../models/eventModel");

// GET /events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({}).sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve events" });
    }
};

// POST /events
const createEvent = async (req, res) => {
  try {
      const newEvent = await Event.create({ ...req.body });
      res.status(201).json(newEvent);
  } catch (error) {
      res.status(400).json({ message: "Failed to create event", error: error.message });
  }
};

// GET /events/:eventId
const getEventById = async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  try {
    const event = await Event.findById(eventId);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve event" });
  }
};

// PUT /events/:eventId
const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      { ...req.body },
      { new: true }
  );
  if (updatedEvent) {
    res.status(200).json(updatedEvent);
  } else {
    res.status(404).json({ message: "Event not found" });
  }
    } catch (error) {
    res.status(500).json({ message: "Failed to update event" });
  }
};

// DELETE /events/:eventId
const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  try {
    const deletedEvent = await Event.findOneAndDelete({ _id: eventId });
    if (deletedEvent) {
      res.status(200).json({ message: "Event deleted successfully" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event" });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};