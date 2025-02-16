const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection (Explicitly connecting to `lava` database)
const MONGO_URI = "mongodb+srv://sam:FtrSurY4KCDAdsU9@cluster0.vaxjv.mongodb.net/lava?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected to 'lava' database"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Schema and Model for `admin` collection
const adminSchema = new mongoose.Schema({
  user_id: String,
  password: String
});

const Admin = mongoose.model("Admin", adminSchema, "admin"); // Accessing "admin" collection in "lava" database

// GET method to fetch only user_id and password from `admin` collection
app.get("/admins", async (req, res) => {
  try {
    const admins = await Admin.find({}, "user_id password -_id"); // Fetch only user_id and password, hide _id
    res.json(admins);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
