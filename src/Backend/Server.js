require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OTP_STORE = new Map();
const PORT = process.env.PORT || 5000;

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Mongoose model
const Fisherman = mongoose.model('Fisherman', new mongoose.Schema({
  name: String,
  mobile: String,
  licenseId: String,
  region: String,
  address: String,
}), 'fishermen_verify');  // 👈 use this collection

// ✅ POST /login - Sends OTP using 2Factor
app.post('/login', async (req, res) => {
  const { name, licenseId, phone } = req.body;
  const mobile = phone.startsWith('+91') ? phone.slice(3) : phone;

  try {
    console.log('Login request:', { name, licenseId, mobile });

    // Find fisherman with matching details
    const fisherman = await Fisherman.findOne({ name, licenseId, mobile: `+91${mobile} `});
    console.log(fisherman);

    if (!fisherman) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    // ✅ Send OTP using 2Factor API
    const otpResponse = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${mobile}/AUTOGEN`
    );

    const sessionId = otpResponse.data.Details;
    console.log('OTP session:', sessionId);

    // Store sessionId temporarily
    OTP_STORE.set(mobile, sessionId);

    // Expire session after 2 minutes
    setTimeout(() => OTP_STORE.delete(mobile), 2 * 60 * 1000);

    res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    console.error('OTP sending error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: err.message });
  }
});

// ✅ POST /verify - Verifies OTP
app.post('/verify', async (req, res) => {
  const { phone, otp } = req.body;
  const mobile = phone.startsWith('+91') ? phone.slice(3) : phone;

  const sessionId = OTP_STORE.get(mobile);
  if (!sessionId) {
    return res.status(400).json({ success: false, message: 'Session expired or invalid' });
  }

  try {
    const verifyResponse = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
    );

    if (verifyResponse.data.Details === 'OTP Matched') {
      OTP_STORE.delete(mobile);
      res.json({ success: true, message: 'OTP verified' });
    } else {
      res.json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error('OTP verification error:', err.message);
    res.status(500).json({ success: false, message: 'Verification failed', error: err.message });
  }
});

// ✅ GET /fisherman/:licenseId - fetch fisherman info
app.get('/fisherman/:licenseId', async (req, res) => {
  try {
    const { licenseId } = req.params;
    const fisherman = await Fisherman.findOne({ licenseId });

    if (!fisherman) {
      return res.status(404).json({ success: false, message: 'Fisherman not found' });
    }

    res.json({ success: true, data: fisherman });
  } catch (err) {
    console.error('Error fetching fisherman:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ GET /test-fisherman - test endpoint
app.get('/test-fisherman', async (req, res) => {
  try {
    const fisherman = await Fisherman.findOne(); // gets first document
    if (fisherman) {
      res.json({ success: true, data: fisherman });
    } else {
      res.json({ success: false, message: 'No fishermen found' });
    }
  } catch (err) {
    console.error('Error fetching fisherman:', err);
    res.status(500).json({ success: false, message: 'Error fetching data', error: err.message });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});