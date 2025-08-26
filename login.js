const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/hiresight", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// User schema
const userSchema = new mongoose.Schema({
  role: String,
  name: String,
  email: String,
  password: String
});
const User = mongoose.model("userdetail", userSchema);

// Login API
app.post("/api/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase(), password, role });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    res.json({ success: true, role: user.role, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
