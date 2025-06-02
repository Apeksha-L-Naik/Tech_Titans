require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OTP_STORE = new Map();
const PORT = process.env.PORT || 5000;

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Fisherman model
const fishermen_verify = mongoose.model('fishermen_verify', {
  name: String,
  mobile: String,
  licenseId: String,
  region: String,
  address: String,
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /login
app.post('/login', async (req, res) => {
  const { name, licenseId, mobile } = req.body;
  console.log('Received:', { name, licenseId, mobile });
  const fishermen = await fishermen_verify.findOne({ name, licenseId, mobile });
  console.log('Found fisherman:', fishermen);

  if (fishermen) {
    const otp = generateOTP();
    OTP_STORE.set(mobile, otp);
    setTimeout(() => OTP_STORE.delete(mobile), 2 * 60 * 1000); // 2 min expiry

    try {
      await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE,
        to: `+91${phone}`,
      });
      res.json({ success: true, message: 'OTP sent' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to send OTP', error: err.message });
    }
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

// POST /verify
app.post('/verify', (req, res) => {
  const { mobile, otp } = req.body;
  if (OTP_STORE.get(mobile) === otp) {
    OTP_STORE.delete(mobile);
    res.json({ success: true, message: 'OTP verified' });
  } else {
    res.json({ success: false, message: 'Invalid OTP' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
