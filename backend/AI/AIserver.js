require("dotenv").config();            // Loading env variable first
const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const generateText = require("./aiController");

const app = express();

const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(cors());            // Allow cross-origin requests

app.get("/", (req, res) => {
    res.send("UrbanGo backend running succesfully");
});

app.post("/api/gemini", generateText)

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(err => {
    console.error("MongoDB connection error:", err);
});

