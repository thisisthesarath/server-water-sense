const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = "mongodb+srv://sam:FtrSurY4KCDAdsU9@cluster0.vaxjv.mongodb.net/lava?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Schema and Model
const adminSchema = new mongoose.Schema({}, { strict: false }); // Allow all fields

const Admin = mongoose.model("admin", adminSchema, "admin"); // Accessing "admin" collection inside "lava" DB

// GET method to fetch only user_id and password
app.get("/admins", async (req, res) => {
  try {
    const admins = await Admin.find({}, "user_id password"); // Fetch user_id and password only
    res.json(admins);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
});

// GET method to fetch all data from admin collection
app.get("/admins/all", async (req, res) => {
  try {
    const allAdmins = await Admin.find({}); // Fetch everything
    res.json(allAdmins);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
