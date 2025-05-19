const Order = require('../models/order');
const Bid   = require('../models/bid');

async function createOrder(req, res) {
  const { productId } = req.body;
  const buyerId = req.userId;
  const highest = await Bid.findOne({
    where: { productId },
    order: [['amount','DESC']]
  });
  if (!highest) {
    return res.status(400).json({ error: '입찰 내역이 없습니다.' });
  }
  const order = await Order.create({
    productId,
    buyerId,
    amount: highest.amount
  });
  res.status(201).json(order);
}

async function confirmDeposit(req, res) {
  const { orderId } = req.body;
  const order = await Order.findByPk(orderId);
  if (!order) {
    return res.status(404).json({ error: '주문을 찾을 수 없습니다.' });
  }
  order.status = 'confirmed';
  await order.save();
  res.json({ message: '입금 확인 완료' });
}

async function listOrders(req, res) {
  const orders = await Order.findAll({
    where: { buyerId: req.userId },
    order: [['createdAt','DESC']]
  });
  res.json(orders);
}

module.exports = { createOrder, confirmDeposit, listOrders };
