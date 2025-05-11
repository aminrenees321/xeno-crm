const Order = require('../models/Order');
const Customer = require('../models/');
const { publishToQueue } = require('../services/rabbitmq');
const logger = require('../services/logger');

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    // Publish to queue for async processing
    await publishToQueue('order_created', orderData);
    
    res.status(202).json({
      success: true,
      message: 'Order creation request accepted and is being processed'
    });
  } catch (error) {
    logger.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, customerId, status, from, to } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    
    if (customerId) {
      whereClause.customerId = customerId;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (from && to) {
      whereClause.orderDate = {
        [Op.between]: [new Date(from), new Date(to)]
      };
    } else if (from) {
      whereClause.orderDate = {
        [Op.gte]: new Date(from)
      };
    } else if (to) {
      whereClause.orderDate = {
        [Op.lte]: new Date(to)
      };
    }
    
    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [{
        model: Customer,
        as: 'customer',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['orderDate', 'DESC']]
    });
    
    res.json({
      success: true,
      data: orders.rows,
      total: orders.count,
      page: parseInt(page),
      totalPages: Math.ceil(orders.count / limit)
    });
  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: Customer,
        as: 'customer',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    await order.update(req.body);
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    logger.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    await order.destroy();
    
    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};

exports.bulkImportOrders = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const file = req.files.file;
    const orders = JSON.parse(file.data.toString());
    
    // Publish to queue for async processing
    await publishToQueue('orders_bulk_import', orders);
    
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