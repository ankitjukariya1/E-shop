const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, createOrder)
  .get(protect, authorize('admin'), getAllOrders);

router.get('/myorders', protect, getMyOrders);

router.get('/:id', protect, getOrder);

router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
