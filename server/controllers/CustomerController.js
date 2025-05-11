const Customer = require('../models/');
const Order = require('../models/Order');
const { publishToQueue } = require('../services/rabbitmq');
const logger = require('../services/logger');

exports.createCustomer = async (req, res) => {
  try {
    const customerData = req.body;
    
    // Publish to queue for async processing
    await publishToQueue('customer_created', customerData);
    
    res.status(202).json({
      success: true,
      message: 'Customer creation request accepted and is being processed'
    });
  } catch (error) {
    logger.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating customer',
      error: error.message
    });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const customers = await Customer.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: customers.rows,
      total: customers.count,
      page: parseInt(page),
      totalPages: Math.ceil(customers.count / limit)
    });
  } catch (error) {
    logger.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: error.message
    });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [{
        model: Order,
        as: 'orders'
      }]
    });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    logger.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer',
      error: error.message
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    await customer.update(req.body);
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    logger.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating customer',
      error: error.message
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    await customer.destroy();
    
    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting customer',
      error: error.message
    });
  }
};

exports.bulkImportCustomers = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const file = req.files.file;
    const customers = JSON.parse(file.data.toString());
    
    // Publish to queue for async processing
    await publishToQueue('customers_bulk_import', customers);
    
    res.status(202).json({
      success: true,
      message: 'Bulk import request accepted and is being processed'
    });
  } catch (error) {
    logger.error('Error in bulk import:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing bulk import',
      error: error.message
    });
  }
};