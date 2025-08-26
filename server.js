const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/hiresight")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Schema + Model
const HiringSchema = new mongoose.Schema({
  department: String,
  position: String,
  location: String,
  total: Number,
  selected: Number,
  rejected: Number,
  pending: Number
});

const Hiring = mongoose.model("Hiring", HiringSchema, "hiring");

// API to fetch hiring data
app.get("/api/hiring", async (req, res) => {
  try {
    const data = await Hiring.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Serve HTML file
app.use(express.static(path.join(__dirname)));

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
