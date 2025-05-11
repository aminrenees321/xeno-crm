const express = require('express');
const passport = require('passport');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { validateOrder } = require('../validators/orderValidator');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validateOrder,
  OrderController.createOrder
);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  OrderController.getAllOrders
);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  OrderController.getOrderById
);

// @route   PUT /api/orders/:id
// @desc    Update order
// @access  Private
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validateOrder,
  OrderController.updateOrder
);

// @route   DELETE /api/orders/:id
// @desc    Delete order
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  OrderController.deleteOrder
);

// @route   POST /api/orders/bulk
// @desc    Bulk import orders
// @access  Private
router.post(
  '/bulk',
  passport.authenticate('jwt', { session: false }),
  OrderController.bulkImportOrders
);

module.exports = router;