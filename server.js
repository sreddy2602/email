
const express = require("express");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const fs = require("fs");
 
const app = express();
app.use(express.json());
 
// Load sample data for email
const sampleData = JSON.parse(fs.readFileSync("sample-data.json", "utf8"));
 
// Configure nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abhinavmolugu426@gmail.com",        // <-- your Gmail address
    pass: "aeth izxv gwbg qquj"      // <-- your 16-char app password
  }
});
 
// Email sending function
function sendSampleEmail(data) {
  const mailOptions = {
    from: '"SAP BTP App" <abhinavmolugu426@gmail.com>',   // <-- your Gmail address
    to: data.to,                                   // recipient's email
    subject: data.subject,
    text: data.text,
    html: data.html
  };
 
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}
 
// 1. Endpoint for SAP Job Scheduler to trigger email
app.post("/trigger-email", (req, res) => {
  const data = req.body && Object.keys(req.body).length > 0 ? req.body : sampleData;
  sendSampleEmail(data);
  res.status(200).json({ message: "Email triggered!" });
});
 
// 2. Schedule job using node-cron (runs every day at 11:47 AM)
cron.schedule("19 16 * * *", () => {
  console.log("Scheduled job triggered. Sending email...");
  sendSampleEmail(sampleData);
});
 
// 3. Health check endpoint
app.get("/", (req, res) => {
  res.send("SAP BTP Email Scheduler is running.");
});
app.get("/trigger-email", (req, res) => {
  sendSampleEmail(sampleData);
  res.send("Email triggered!");
});
 
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});