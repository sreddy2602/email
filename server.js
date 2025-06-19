const express = require("express");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const fs = require("fs");

const app = express();
app.use(express.json());

// Load sample data for email
const sampleData = JSON.parse(fs.readFileSync("sample-data.json", "utf8"));

// Configure nodemailer transporter (Ethereal for testing)
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "rgdrl64n6mrfsytb@ethereal.email", // Replace with your Ethereal user
    pass: "4j2w1pC761fTWdFuNn"              // Replace with your Ethereal password
  }
});

// Email sending function
function sendSampleEmail(data) {
  const mailOptions = {
    from: '"SAP BTP App" <sharvanisankepally02@gmail.com>',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
      // Print Ethereal preview URL for testing
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  });
}

// 1. Endpoint for SAP Job Scheduler to trigger email
app.post("/trigger-email", (req, res) => {
  // Use sample data or accept data from the request body
  const data = req.body && Object.keys(req.body).length > 0 ? req.body : sampleData;
  sendSampleEmail(data);
  res.status(200).json({ message: "Email triggered!" });
});

// 2. Schedule job using node-cron (runs every day at  AM)
cron.schedule("13 12 * * *", () => {
  console.log("Scheduled job triggered. Sending email...");
  sendSampleEmail(sampleData);
});

// 3. Health check endpoint
app.get("/", (req, res) => {
  res.send("SAP BTP Email Scheduler is running.");
});

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});