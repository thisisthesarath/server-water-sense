require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://sam:FtrSurY4KCDAdsU9@cluster0.vaxjv.mongodb.net/lava?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Schema and Model
const adminSchema = new mongoose.Schema({}, { strict: false });
const Admin = mongoose.model("admin", adminSchema, "admin"); // "admin" collection inside "lava" DB

// GET method to fetch only user_id and password
app.get("/admins", async (req, res) => {
  try {
    const admins = await Admin.find({}, "user_id password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
});

// GET method to fetch all data from admin collection
app.get("/admins/all", async (req, res) => {
  try {
    const allAdmins = await Admin.find({});
    res.json(allAdmins);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
});

// GET method to fetch all data from tlava collection
app.get("/tlava/all", async (req, res) => {
  try {
    const allData = await TLava.find({}); // Fetch all documents
    res.json({ success: true, data: allData });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err });
  }
});

// Nodemailer Configuration for Brevo SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS required
  auth: {
    user: process.env.SMTP_USER || "754f2c001@smtp-brevo.com", // Replace with your SMTP username
    pass: process.env.SMTP_PASS || "wCvGOcd9mIps7X8y", // Replace with your SMTP password
  },
});

// Define the tlava collection
const tlavaSchema = new mongoose.Schema({}, { strict: false });
const TLava = mongoose.model("tlava", tlavaSchema, "tlava"); // "tlava" collection inside "lava" DB

// Function to send email
const sendEmail = async (data) => {
  const mailOptions = {
    from: '"Water Monitoring System" <754f2c001@smtp-brevo.com>',
    to:"ping.johnsamuel@gmail.com",
    cc: "palanisamytamil753@gmail.com, spalanisamy292@gmail.com", // Send to company email if available
    subject: `🚨 Water Quality Alert: ${data.company_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        
        <!-- Header -->
        <h2 style="background-color: #f44336; color: white; text-align: center; padding: 10px; border-radius: 5px;">
          🚨 Water Quality Monitoring Alert
        </h2>

        <!-- Table -->
        <p>Hello,</p>
        <p>A new water quality reading has been recorded. Please review the details below:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px;">Company Name</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Area</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Timestamp</th>
            <th style="border: 1px solid #ddd; padding: 8px;">pH</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Turbidity</th>
            <th style="border: 1px solid #ddd; padding: 8px;">TDS</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${data.company_name}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${data.area}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${new Date(data.timestamp).toLocaleString()}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${data.ph}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${data.turbidity}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${data.tds}</td>
          </tr>
        </table>

        <p style="margin-top: 15px;">Please take necessary actions if the readings exceed permissible limits.</p>

        <!-- Footer -->
        <hr>
        <p style="text-align: center; font-size: 12px; color: #555;">
          🚰 Water Quality Monitoring System <br>
          📍 Environmental Protection Agency <br>
          📧 support@watersense.in <br>
          📞 +91-9003802153
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email Sent Successfully");
  } catch (err) {
    console.error("❌ Error Sending Email:", err);
  }
};


// Watch for new documents
TLava.watch().on("change", async (change) => {
  if (change.operationType === "insert") {
    const newData = change.fullDocument;
    console.log("📌 New Data Inserted:", newData);
    sendEmail(newData);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
