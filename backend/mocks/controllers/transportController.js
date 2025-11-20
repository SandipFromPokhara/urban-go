const Transport = require("../../src/models/transportModel");

// GET /transports
const getAllTransports = async (req, res) => {
    try {
        const transports = await Transport.find({}).sort({ createdAt: -1 });
        res.status(200).json(transports);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve transports" });
    }
};
// POST /transports
const createTransport = async (req, res) => {
  try {
      const newTransport = await Transport.create({ ...req.body });
      res.status(201).json(newTransport);
  } catch (error) {
      res.status(400).json({ message: "Failed to create transport", error: error.message });
  }
};

// GET /blogs/:blogId
const getTransportById = async (req, res) => {
  const { transportId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(transportId)) {
    return res.status(400).json({ message: "Invalid transport ID" });
  }

  try {
    const transport = await Transport.findById(transportId);
    if (transport) {
      res.status(200).json(transport);
    } else {
      res.status(404).json({ message: "Transport not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve transport" });
  }
};

// PUT /transports/:transportId
const updateTransport = async (req, res) => {
  const { transportId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(transportId)) {
    return res.status(400).json({ message: "Invalid transport ID" });
  }

  try {
    const updatedTransport = await Transport.findOneAndUpdate(
      { _id: blogId },
      { ...req.body },
      { new: true }
  );
  if (updatedTransport) {
    res.status(200).json(updatedTransport);
  } else {
    res.status(404).json({ message: "Transport not found" });
  }
  } catch (error) {
    res.status(500).json({ message: "Failed to update transport" });
  }
};

// DELETE /transports/:transportId
const deleteTransport = async (req, res) => {
  const { transportId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(transportId)) {
    return res.status(400).json({ message: "Invalid transport ID" });
  }

  try {
    const deletedTransport = await Transport.findOneAndDelete({ _id: transportId });
    if (deletedTransport) {
      res.status(200).json({ message: "Transport deleted successfully" });
    } else {    
      res.status(404).json({ message: "Transport not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete transport" });
  }
};

module.exports = {
  getAllTransports,
  getTransportById,
  createTransport,
  updateTransport,
  deleteTransport,
};
