const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// 1) Connect MongoDB Compass
mongoose.connect('mongodb://127.0.0.1:27017/hireSightDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error: ", err));

// 2) Schema + Model
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    status: String
});
const User = mongoose.model('hiring', UserSchema, 'hiring');

// 3) API Routes
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.post('/api/users', async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: "User added!", user: newUser });
});

app.put('/api/users/:id', async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "User updated!", user: updatedUser });
});

app.delete('/api/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted!" });
});

// 4) Route for usermanagement.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'usermanagement.html'));
});

// 5) Start server
app.listen(5004, () => console.log("🚀 Server running at http://localhost:5004"));
