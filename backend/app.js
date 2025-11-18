//To text postman collection
const express = require("express");
const { events, users, transports } = require("./data");

const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("API Running with local data.js");
});

// EVENTS ROUTES
app.get("/api/events", (req, res) => {
  res.json(events);
});

app.post("/api/events", (req, res) => {
  const newEvent = {
    id: events.length + 1, // simple incremental ID
    ...req.body
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

app.get("/api/events/:id", (req, res) => {
  const event = events.find(e => e.id === Number(req.params.id));
  event ? res.json(event) : res.status(404).json({ error: "Event not found" });
});
app.put("/api/events/:id", (req, res) => {
  const eventIndex = events.findIndex(e => e.id === Number(req.params.id));
  if (eventIndex !== -1) {
    events[eventIndex] = { id: events[eventIndex].id, ...req.body };
    res.json(events[eventIndex]);
  } else {
    res.status(404).json({ error: "Event not found" });
  }
});

app.delete("/api/events/:id", (req, res) => {
  const eventIndex = events.findIndex(e => e.id === Number(req.params.id));
  if (eventIndex !== -1) {
    const deletedEvent = events.splice(eventIndex, 1);
    res.json(deletedEvent[0]);
  } else {
    res.status(404).json({ error: "Event not found" });
  }
});

// USERS ROUTES
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const newUser = {
    id: users.length + 1, // simple incremental ID
    ...req.body
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

app.get("/api/users/:id", (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

app.put("/api/users/:id", (req, res) => {
  const userIndex = users.findIndex(u => u.id === Number(req.params.id));
  if (userIndex !== -1) {
    users[userIndex] = { id: users[userIndex].id, ...req.body };
    res.json(users[userIndex]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.delete("/api/users/:id", (req, res) => {
  const userIndex = users.findIndex(u => u.id === Number(req.params.id));
  if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1);
    res.json({message: "User deleted successfully"});
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// TRANSPORT ROUTES
app.get("/api/transports", (req, res) => {
  res.json(transports);
});

app.post("/api/transports", (req, res) => {
  const newTransport = {
    id: transports.length + 1, // simple incremental ID
    ...req.body
  };

  transports.push(newTransport);
  res.status(201).json(newTransport);
});

app.get("/api/transports/:id", (req, res) => {
  const transport = transports.find(t => t.id === Number(req.params.id));
  transport
    ? res.json(transport)
    : res.status(404).json({ error: "Transport not found" });
});

app.put("/api/transports/:id", (req, res) => {
  const transportIndex = transports.findIndex(t => t.id === Number(req.params.id));
  if (transportIndex !== -1) {
    transports[transportIndex] = { id: transports[transportIndex].id, ...req.body };
    res.json(transports[transportIndex]);
  } else {
    res.status(404).json({ error: "Transport not found" });
  }
});

app.delete("/api/transports/:id", (req, res) => {
  const transportIndex = transports.findIndex(t => t.id === Number(req.params.id));
  if (transportIndex !== -1) {
    const deletedTransport = transports.splice(transportIndex, 1);
    res.json(deletedTransport[0]);
  } else {
    res.status(404).json({ error: "Transport not found" });
  }
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
