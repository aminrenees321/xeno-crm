const amqp = require('amqplib');
const logger = require('./logger');
const { sequelize } = require('../config/database');
const Customer = require('../models/Customer');
const Order = require('../models/Order');


const CONFIG = {
  PREFETCH_COUNT: 5,      
  RETRY_LIMIT: 3,         
  RETRY_DELAY: 5000,      
  QUEUE_SETTINGS: {       
    durable: true,
    deadLetterExchange: 'dlx',
    deadLetterRoutingKey: 'dead_letters'
  }
};

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    connection.on('error', handleConnectionError);
    connection.on('close', handleConnectionClose);

    
    channel = await connection.createChannel();
    await channel.prefetch(CONFIG.PREFETCH_COUNT);

   
    await channel.assertExchange('dlx', 'direct', { durable: true });
    await channel.assertQueue('dead_letters', { durable: true });
    await channel.bindQueue('dead_letters', 'dlx', 'dead_letters');

    
    await Promise.all([
      channel.assertQueue('customer_created', CONFIG.QUEUE_SETTINGS),
      channel.assertQueue('order_created', CONFIG.QUEUE_SETTINGS),
      channel.assertQueue('customers_bulk_import', CONFIG.QUEUE_SETTINGS),
      channel.assertQueue('orders_bulk_import', CONFIG.QUEUE_SETTINGS)
    ]);

    
    startConsumers();

    logger.info('RabbitMQ connected and consumers started');
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
    process.exit(1);
  }
};

const startConsumers = () => {
  consumeCustomerCreated();
  consumeOrderCreated();
  consumeBulkCustomers();
  consumeBulkOrders();
};

const publishToQueue = async (queueName, data, options = {}) => {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  
  try {
    await channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(data)),
      { persistent: true, ...options }
    );
    logger.debug(`Published to ${queueName}:`, data);
  } catch (error) {
    logger.error(`Failed to publish to ${queueName}:`, error);
    throw error;
  }
};

const consumeCustomerCreated = () => {
  channel.consume('customer_created', async (msg) => {
    if (!msg) return;

    try {
      const customerData = JSON.parse(msg.content.toString());
      const transaction = await sequelize.transaction();

      try {
        const customer = await Customer.create(customerData, { transaction });
        await transaction.commit();
        channel.ack(msg);
        logger.info(`Customer created: ${customer.id}`);
      } catch (error) {
        await transaction.rollback();
        handleFailedMessage(msg, 'customer_created', error);
      }
    } catch (error) {
      handleFailedMessage(msg, 'customer_created', error);
    }
  }, { noAck: false });
};

const consumeOrderCreated = () => {
  channel.consume('order_created', async (msg) => {
    if (!msg) return;

    try {
      const orderData = JSON.parse(msg.content.toString());
      const transaction = await sequelize.transaction();

      try {
        const order = await Order.create(orderData, { transaction});
        
        await Customer.update({
          totalSpent: sequelize.literal(`totalSpent + ${orderData.totalAmount}`),
          totalOrders: sequelize.literal('totalOrders + 1'),
          lastPurchaseDate: new Date()
        }, {
          where: { id: orderData.customerId },
          transaction
        });

        await transaction.commit();
        channel.ack(msg);
        logger.info(`Order created: ${order.id}`);
      } catch (error) {
        await transaction.rollback();
        handleFailedMessage(msg, 'order_created', error);
      }
    } catch (error) {
      handleFailedMessage(msg, 'order_created', error);
    }
  }, { noAck: false });
};

const consumeBulkCustomers = () => {
  channel.consume('customers_bulk_import', async (msg) => {
    if (!msg) return;

    try {
      const customers = JSON.parse(msg.content.toString());
      const transaction = await sequelize.transaction();

      try {
        await Customer.bulkCreate(customers, { transaction });
        await transaction.commit();
        channel.ack(msg);
        logger.info(`Bulk imported ${customers.length} customers`);
      } catch (error) {
        await transaction.rollback();
        handleFailedMessage(msg, 'customers_bulk_import', error);
      }
    } catch (error) {
      handleFailedMessage(msg, 'customers_bulk_import', error);
    }
  }, { noAck: false });
};

const consumeBulkOrders = () => {
  channel.consume('orders_bulk_import', async (msg) => {
    if (!msg) return;

    try {
      const orders = JSON.parse(msg.content.toString());
      const transaction = await sequelize.transaction();

      try {
        await Order.bulkCreate(orders, { transaction });

        // Process customer updates
        const customerUpdates = {};
        orders.forEach(order => {
          if (!customerUpdates[order.customerId]) {
            customerUpdates[order.customerId] = {
              totalAmount: 0,
              orderCount: 0
            };
          }
          customerUpdates[order.customerId].totalAmount += order.totalAmount;
          customerUpdates[order.customerId].orderCount += 1;
        });

        await Promise.all(Object.entries(customerUpdates).map(([customerId, stats]) => 
          Customer.update({
            totalSpent: sequelize.literal(`totalSpent + ${stats.totalAmount}`),
            totalOrders: sequelize.literal(`totalOrders + ${stats.orderCount}`),
            lastPurchaseDate: new Date()
          }, {
            where: { id: customerId },
            transaction
          })
        ));

        await transaction.commit();
        channel.ack(msg);
        logger.info(`Bulk imported ${orders.length} orders`);
      } catch (error) {
        await transaction.rollback();
        handleFailedMessage(msg, 'orders_bulk_import', error);
      }
    } catch (error) {
      handleFailedMessage(msg, 'orders_bulk_import', error);
    }
  }, { noAck: false });
};

const handleFailedMessage = (msg, queueName, error) => {
  const retryCount = (msg.properties.headers['x-retry-count'] || 0) + 1;

  if (retryCount <= CONFIG.RETRY_LIMIT) {
    logger.warn(`Retrying message (attempt ${retryCount}) on ${queueName}:`, error.message);
    
    setTimeout(() => {
      channel.publish('', queueName, msg.content, {
        persistent: true,
        headers: { 'x-retry-count': retryCount }
      });
      channel.ack(msg);
    }, CONFIG.RETRY_DELAY);
  } else {
    logger.error(`Message failed after ${retryCount} attempts on ${queueName}:`, error.message);
    channel.reject(msg, false); // Send to dead letter queue
  }
};

const handleConnectionError = (error) => {
  if (error.message !== 'Connection closing') {
    logger.error('RabbitMQ connection error:', error);
  }
};

const handleConnectionClose = () => {
  logger.warn('RabbitMQ connection closed, attempting to reconnect...');
  setTimeout(connectRabbitMQ, 5000);
};

const closeConnection = async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    logger.info('RabbitMQ connection closed gracefully');
  } catch (error) {
    logger.error('Error closing RabbitMQ connection:', error);
  }
};

process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);

module.exports = {
  connectRabbitMQ,
  publishToQueue,
  closeConnection
};