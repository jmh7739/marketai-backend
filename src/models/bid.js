const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('Bid', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  bidderId:  { type: DataTypes.INTEGER, allowNull: false },
  amount:    { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'bids',
  timestamps: true
});
