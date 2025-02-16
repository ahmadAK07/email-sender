const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = 3000;

app.use(cors("*"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Set up Multer storage in memory (No file system access)
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint to handle multiple image uploads
app.post("/upload-images", upload.array("imgFiles"), async (req, res) => {
  try {
    const { url, content, to } = req.body;
    const imgFiles = req.files || []; // Array of uploaded image files (can be empty)

    // Send email with optional attachments
    await sendEmailWithImages(url, content, imgFiles, res, to);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message, success: false });
  }
});

// Function to send email with optional attachments
async function sendEmailWithImages(url, content, imgFiles, res, to) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.FROM,
      pass: process.env.PASS,
    },
  });

  // Attach uploaded images if any exist
  const attachments = imgFiles.length > 0
    ? imgFiles.map((file) => ({
        filename: file.originalname,
        content: file.buffer, // Use buffer instead of file path
      }))
    : [];

  const mailOptions = {
    from: process.env.FROM,
    to: to,
    subject: "InfoSave",
    text: `URL: ${url}\n`,
    html: content,
    ...(attachments.length > 0 && { attachments }), // Add attachments only if they exist
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Error sending email", details: error.message, success: false });
  }
}

app.get("/", (req, res) => {
  res.json({ message: "Email Sender", success: true });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

