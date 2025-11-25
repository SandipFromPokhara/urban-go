const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

const generateEventPlan  = require("./controllers/eventController");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.post('/events/recommend',generateEventPlan );

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



