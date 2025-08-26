const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/hiresight", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("✅ Connected to MongoDB (hiresight DB)");
});

// ✅ User Schema
const userSchema = new mongoose.Schema({
  role: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("userdetail", userSchema);

// ✅ Register API
app.post("/api/register", async (req, res) => {
  try {
    const { role, name, email, password } = req.body;

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = new User({ role, name, email, password });
    await user.save();
    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Get all users (for testing)
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
