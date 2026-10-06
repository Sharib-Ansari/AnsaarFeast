require('dotenv').config();
const express = require('express');
const User = require('../models/User');
const Order = require('../models/Orders');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fetchUser = require('../middleware/fetchdetails');

const jwtSecret = process.env.JWT_SECRET;

// POST /api/auth/createuser — Register a new user (no login required)
router.post(
  '/createuser',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('name', 'Name must be at least 3 characters').isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      // Check if email is already registered
      const existing = await User.findOne({ email: req.body.email });
      if (existing) {
        return res
          .status(400)
          .json({ success, error: 'An account with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const securePass = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        name: req.body.name,
        password: securePass,
        email: req.body.email,
        location: req.body.location || '',
      });

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, jwtSecret);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error('createuser error:', error.message);
      res.status(500).json({ success, error: 'Server error. Please try again.' });
    }
  }
);

// POST /api/auth/login — Authenticate user (no login required)
router.post(
  '/login',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: 'No account found with this email.' });
      }

      const pwdCompare = await bcrypt.compare(password, user.password);
      if (!pwdCompare) {
        return res
          .status(400)
          .json({ success, error: 'Incorrect password. Please try again.' });
      }

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, jwtSecret);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error('login error:', error.message);
      res.status(500).json({ success, error: 'Server error. Please try again.' });
    }
  }
);

// POST /api/auth/getuser — Get logged-in user details (login required)
router.post('/getuser', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('getuser error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/auth/getlocation — Reverse geocode lat/long via OpenCage
router.post('/getlocation', async (req, res) => {
  try {
    const { lat, long } = req.body.latlong;
    const apiKey = process.env.OPENCAGE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Geocoding API key not configured.' });
    }

    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${apiKey}`
    );

    const components = response.data.results[0].components;
    const { village, county, state_district, state, postcode } = components;
    const location = `${village || ''},${county || ''},${state_district || ''},${state || ''}\n${postcode || ''}`;

    res.json({ location });
  } catch (error) {
    console.error('getlocation error:', error.message);
    res.status(500).json({ error: 'Could not fetch location. Please enter address manually.' });
  }
});

// POST /api/auth/foodData — Get all food items and categories
router.post('/foodData', async (req, res) => {
  try {
    if (!global.foodData || !global.foodCategory) {
      return res.status(503).json({ error: 'Food data not loaded yet. Please retry.' });
    }
    res.json([global.foodData, global.foodCategory]);
  } catch (error) {
    console.error('foodData error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/auth/orderData — Place / update an order
router.post('/orderData', async (req, res) => {
  try {
    const orderEntry = [{ Order_date: req.body.order_date }, ...req.body.order_data];
    const email = req.body.email;

    const existing = await Order.findOne({ email });

    if (!existing) {
      await Order.create({ email, order_data: [orderEntry] });
    } else {
      await Order.findOneAndUpdate({ email }, { $push: { order_data: orderEntry } });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('orderData error:', error.message);
    res.status(500).json({ success: false, error: 'Server error. Could not place order.' });
  }
});

// POST /api/auth/myOrderData — Get all orders for a user
router.post('/myOrderData', async (req, res) => {
  try {
    const orderDoc = await Order.findOne({ email: req.body.email });
    res.json({ orderData: orderDoc });
  } catch (error) {
    console.error('myOrderData error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;