const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CommunicationLog = sequelize.define('CommunicationLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  campaignId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'campaigns',
      key: 'id'
    }
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'failed', 'delivered'),
    defaultValue: 'pending'
  },
  deliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'communication_logs',
  timestamps: true,
  indexes: [
    {
      fields: ['campaignId']
    },
    {
      fields: ['customerId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = CommunicationLog;