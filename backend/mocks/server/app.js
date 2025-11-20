//To text postman collection
const express = require("express");
const { events, users, transports } = require("./data");

const app = express();
app.use(json());

app.get("/", (req, res) => {
  res.send("API Running with local data.js");
});

// EVENTS ROUTES
app.get("/events", (req, res) => {
  res.json(events);
});

app.get("/events/:id", (req, res) => {
  const event = events.find(e => e.id === Number(req.params.id));
  event ? res.json(event) : res.status(404).json({ error: "Event not found" });
});

// USERS ROUTES
app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

// TRANSPORT ROUTES
app.get("/transports", (req, res) => {
  res.json(transports);
});

app.get("/transports/:id", (req, res) => {
  const transport = transports.find(t => t.id === Number(req.params.id));
  transport
    ? res.json(transport)
    : res.status(404).json({ error: "Transport not found" });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
