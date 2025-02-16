const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();
const port = 3000;

app.use(cors("*"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Set up Multer storage (handling multiple file uploads)
const upload = multer({ dest: "uploads/" });

// Endpoint to handle multiple image uploads
app.post("/upload-images", upload.array("imgFiles"), async (req, res) => {
  try {
    const { url, content } = req.body;
    const imgFiles = req.files; // Array of uploaded image files

    if (!imgFiles || imgFiles.length === 0) {
      return res.status(400).json({ error: "No image files uploaded" , success: true});
    }

    // Send email with multiple image attachments
    await sendEmailWithImages(url, content, imgFiles, res);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message , success: true });
  }
});

// Function to send email with multiple image attachments
async function sendEmailWithImages(url, content, imgFiles, res) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "muhammadahmadamin512@gmail.com",
      pass: "trqi psxn ttvp qsbr",
    },
  });

  // Attach all uploaded images to email
  const attachments = imgFiles.map((file) => ({
    filename: file.originalname,
    path: file.path,
  }));

  const mailOptions = {
    from: "muhammadahmadamin512@gmail.com",
    to: "muhammadahmadhafiz512@gmail.com",
    subject: "New Images Upload",
    text: `URL: ${url}\n`,
    html: content,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Images uploaded and email sent successfully" , success: true});

    // Delete all image files after sending the email
    imgFiles.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Error sending email", details: error.message, success: false });
  }
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


  // muhammadahmadamin512@gmail.com
// trqi psxn ttvp qsbr