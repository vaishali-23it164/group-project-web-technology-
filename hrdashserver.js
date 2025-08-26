const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/hiresight", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected..."))
  .catch(err => console.error(err));

// ✅ Define Schema & Model
const applicantSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  applied_date: String,
  status: String,
  experience: Number,
  skills: String,
  qualification: String,
  location: String,
  project: String
});

const Applicant = mongoose.model("Applicant", applicantSchema);

// ✅ API to fetch all applicants
app.get("/api/applicants", async (req, res) => {
  try {
    const applicants = await Applicant.find();
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
app.listen(5004, () => console.log("Server running on http://localhost:5000"));
const path = require("path");

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Root route -> serve dashboard.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "hrdashboard.html"));
});
