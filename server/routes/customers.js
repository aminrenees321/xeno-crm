const express = require('express');
const passport = require('passport');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');
const { validateCustomer } = require('../validators/customerValidator');

// @route   POST /api/customers
// @desc    Create a new customer
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validateCustomer,
  CustomerController.createCustomer
);

// @route   GET /api/customers
// @desc    Get all customers
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  CustomerController.getAllCustomers
);

// @route   GET /api/customers/:id
// @desc    Get customer by ID
// @access  Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  CustomerController.getCustomerById
);

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validateCustomer,
  CustomerController.updateCustomer
);

// @route   DELETE /api/customers/:id
// @desc    Delete customer
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  CustomerController.deleteCustomer
);

// @route   POST /api/customers/bulk
// @desc    Bulk import customers
// @access  Private
router.post(
  '/bulk',
  passport.authenticate('jwt', { session: false }),
  CustomerController.bulkImportCustomers
);

module.exports = router;