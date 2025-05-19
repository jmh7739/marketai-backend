const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('Order', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  buyerId:   { type: DataTypes.INTEGER, allowNull: false },
  amount:    { type: DataTypes.INTEGER, allowNull: false },
  status:    { type: DataTypes.ENUM('pending','confirmed'), defaultValue: 'pending' }
}, {
  tableName: 'orders',
  timestamps: true
});
