const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../security/auth');
const {
  createCheckoutSession,
  getCheckoutSession,
  getShippingRates
} = require('../controller/checkoutcontroller');

// Checkout Routes
router.post('/session/create', authenticateToken, createCheckoutSession);
router.get('/session/:sessionId', authenticateToken, getCheckoutSession);


module.exports = router;
