const express = require('express');
const nodemailer = require('nodemailer');
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res)=>{
    res.send("working")
})
// POST route for sending email
app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'muhammadahmadamin512@gmail.com',
      pass: 'AK,.57000',
    },
  });

  // Define email options
  const mailOptions = {
    from: 'muhammadahmadamin512@gmail.com',
    to,
    subject,
    text,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ error: 'Error occurred while sending email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
