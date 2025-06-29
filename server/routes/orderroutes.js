const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../security/auth');
const {
  createOrder,
  getUserOrders,
  getOrder,
  updatePaymentStatus,
  cancelOrder,
  paymentWebhook
} = require('../controller/ordercontroller');

// Order Routes
router.post('/create', authenticateToken, createOrder);
router.get('/user', authenticateToken, getUserOrders);
router.get('/:orderNumber', authenticateToken, getOrder);
router.put('/cancel/:orderNumber', authenticateToken, cancelOrder);
router.put('/paymentstatus', updatePaymentStatus);
router.post('/webhook', paymentWebhook);


module.exports = router;
